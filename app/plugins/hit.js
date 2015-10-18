var _ = require('lodash');
var Influent = require('influent');

exports.register = function (server, options, next) {

  server.on('tail', function (request) {
    var received = request.info.received;
    var timestamp = received * 1E6;
    var duration = request.info.responded - received;
    var visit = request.state.visit || _.find(request._states, {name: 'visit'}).value; // FIXME
    var visitor = request.state.visitor || _.find(request._states, {name: 'visitor'}).value; // FIXME
    var measurement = new Influent.Measurement('hit');

    measurement.setTimestamp(timestamp.toString());
    measurement.addField('duration', new Influent.Value(duration));
    measurement.addField('remoteAddress', new Influent.Value(request.info.remoteAddress));
    measurement.addField('statusCode', new Influent.Value(request.response.statusCode));
    measurement.addField('userAgent', new Influent.Value(request.headers['user-agent']));
    measurement.addField('value', new Influent.Value(request.path));
    measurement.addField('visit', new Influent.Value(visit));
    measurement.addField('visitor', new Influent.Value(visitor));
    measurement.addField('variety', new Influent.Value(request.response.variety));

    Influent.createClient({
      username: 'admin',
      password: 'admin',
      database: 'todomvc',
      server: [
        {
          protocol: 'http',
          host: process.env.INFLUXDB_PORT_8086_TCP_ADDR,
          port: 8086
        }
      ]
    }).then(function (client) {
      return client.writeOne(measurement);
    });
  });

  return next();
};

exports.register.attributes = {
  name: 'hit'
};