var _ = require('lodash');
var Cuid = require('cuid');

exports.register = function (server, options, next) {

  server.state('visit', {
    clearInvalid: true
  });

  server.ext('onPreResponse', function (request, reply) {
    if (!request.state.visit) {
      reply.state('visit', Cuid());
    }

    return reply.continue();
  });

  return next();
};

exports.register.attributes = {
  name: 'visit'
};