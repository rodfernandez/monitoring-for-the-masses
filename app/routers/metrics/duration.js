var _ = require('lodash');
var Influent = require('influent');

module.exports = function (request, reply) {
  var received = request.info.received;
  var visit = request.state.visit || _.find(request._states, {name: 'visit'}).value; // FIXME

  var measurements = _.map(JSON.parse(request.payload), function (entry) {
    var timestamp = entry.startTime * 1E6;
    var measurement = new Influent.Measurement(entry.entryType);

    measurement.setTimestamp(timestamp.toString());
    measurement.addTag('name', entry.name);
    measurement.addField('value', new Influent.Value(entry.duration));
    measurement.addField('visit', new Influent.Value(visit));

    return measurement;
  });

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
    return client.writeMany(measurements);
  }).then(function () {
    reply(200);
  }).catch(function (error) {
    reply(error);
  });

};