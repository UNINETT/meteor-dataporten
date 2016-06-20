Dataporten = {};

OAuth.registerService('dataporten', 2, null, function(query) {

  var accessToken = getAccessToken(query);
  var identity = getIdentity(accessToken);

  return {
    serviceData: {
      id: identity.user.userid,
      accessToken: OAuth.sealSecret(accessToken),
      emails: [{address:identity.user.email, verified:false}]
    },
    options: {
      profile: {name: identity.user.userid, fullname: identity.user.name}, 
      username:identity.user.userid,
      email: identity.user.email,
      emails:[{
          address:identity.user.email,
          verified: false
        }]},
    emails: [{address:identity.user.email, verified:false}],
    email:identity.user.email
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
  var clientId = process.env.DATAPORTEN_CLIENTID || config.clientId;
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
          //client_secret: OAuth.openSecret(config.secret),
          redirect_uri: OAuth._redirectUri('dataporten', config),
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


Dataporten.retrieveCredential = function(credentialToken, credentialSecret) {
  return OAuth.retrieveCredential(credentialToken, credentialSecret);
};
