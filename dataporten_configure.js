Template.configureLoginServiceDialogForDataporten.helpers({
  siteUrl: function () {
    return Meteor.absoluteUrl();
  }
});

Template.configureLoginServiceDialogForDataporten.fields = function () {
  return [
    {property: 'clientId', label: 'Client ID'},
    {property: 'secret', label: 'Client Secret'},
    {property: 'redirect_url', label: 'Redirect URI'}
  ];
};
