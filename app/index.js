var hapi = require('hapi');

var server = new hapi.Server();

server.connection({
  port: 8080
});

server.register([
  {
    register: require('inert')
  },
  {
    register: require('./plugins/hit')
  },
  {
    register: require('./plugins/visit')
  },
  {
    register: require('./plugins/visitor')
  }
], function (error) {
  if (error) {
    console.log('Error while registering plugins: %s', error.message);
    return process.exit(-1);
  }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: require('./routers/static')
  });

  server.route({
    method: 'POST',
    path: '/beacon',
    handler: require('./routers/metrics/duration')
  });

  server.start(function () {
    console.log('Server running at:', server.info.uri);
  });
});
