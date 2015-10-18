var _ = require('lodash');
var Cuid = require('cuid');

exports.register = function (server, options, next) {

  server.state('visitor', {
    ttl: 10 * 365 * 24 * 60 * 60 * 1000, // 10 years
    clearInvalid: true
  });

  server.ext('onPreResponse', function (request, reply) {
    if (!request.state.visitor) {
      reply.state('visitor', Cuid());
    }

    return reply.continue();
  });

  return next();
};

exports.register.attributes = {
  name: 'visitor'
};