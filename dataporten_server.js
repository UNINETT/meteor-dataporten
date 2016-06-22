Dataporten = {};

OAuth.registerService('dataporten', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);
  var groups = getGroups(accessToken);

  return {
    serviceData: {
      id: identity.user.userid,
      accessToken: OAuth.sealSecret(accessToken),
      email: identity:user.email,
      groups: groups
    },
    options: {
      profile: {name: identity.user.userid, fullname: identity.user.name}, 
      username:identity.user.userid,
    },
  };
});

var userAgent = "Meteor";
if (Meteor.release)
  userAgent += "/" + Meteor.release;

var getAccessToken = function (query) {
  var config = ServiceConfiguration.configurations.findOne({service: 'dataporten'});
  if (!config)
    throw new ServiceConfiguration.ConfigError();

  var response;
  var clientId = config.clientId;
  //var clientSecret = process.env.DATAPORTEN_CLIENTSECRET || config.clientSecret;
  try {
    response = HTTP.post(
      "https://auth.dataporten.no/oauth/token", {
        headers: {
          Accept: 'application/json',
          "User-Agent": userAgent
        },
        params: {
          grant_type: 'authorization_code',
          code: query.code,
          client_id: clientId,
          client_secret: OAuth.openSecret(config.secret),
          //redirect_uri: OAuth._redirectUri('dataporten', config),
          redirect_uri: config.redirect_url,
          state: query.state
        }
      });
  } catch (err) {
    throw _.extend(new Error("Failed to complete OAuth handshake with Dataporten. " + err.message),
                   {response: err.response});
  }
  if (response.data.error) { // if the http response was a json object with an error attribute
    throw new Error("Failed to complete OAuth handshake with Dataporten. " + response.data.error);
  } else {
    return response.data.access_token;
  }
};

var getIdentity = function (accessToken) {
  try {
    return HTTP.get(
      "https://auth.dataporten.no/userinfo", {
        headers: {"User-Agent": userAgent}, // http://developer.dataporten.com/v3/#user-agent-required
        params: {access_token: accessToken}
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Dataporten. " + err.message),
                   {response: err.response});
  }
};


var getGroups = function (accessToken) {
  try {
    return HTTP.get(
      "https://groups-api.dataporten.no/groups/me/groups", {
        headers: {"User-Agent": userAgent,
        "Authorization": "Bearer " + accessToken}, // http://developer.dataporten.com/v3/#user-agent-required
        params: {access_token: accessToken,
        "Authorization": "Bearer " + accessToken}
      }).data;
  } catch (err) {
    throw _.extend(new Error("Failed to fetch identity from Dataporten. " + err.message),
                   {response: err.response});
  }
};


Dataporten.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
