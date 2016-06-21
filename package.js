Package.describe({
  summary: "Dataporten OAuth flow",
  version: "0.0.9",
  git: 'https://github.com/kasperrt/meteor-dataporten.git',
  name: 'kasperrt:dataporten',
  documentation: null
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use('oauth2', ['client', 'server']);
  api.use('oauth', ['client', 'server']);
  api.use('http', ['server']);
  api.use('underscore', 'client');
  api.use('templating', 'client');
  api.use('random', 'client');
  api.use('service-configuration', ['client', 'server']);

  api.export('Dataporten');

  api.addFiles(
    ['dataporten_configure.html', 'dataporten_configure.js'],
    'client');

  api.addFiles('dataporten_server.js', 'server');
  api.addFiles('dataporten_client.js', 'client');
});
