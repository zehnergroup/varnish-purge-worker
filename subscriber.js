var fs = require('fs'),
    config = fs.readFileSync('./config.json');

console.log('Loading configuration from file.');
try {
  config = JSON.parse(config);
} catch (err) {
  console.log('There has been an error parsing the configuration file (config.json).')
  console.log(err);
  process.exit(1);
}

var redis = require("redis"),
    redis_client = redis.createClient(config.redis.port, config.redis.host),
    varnish = require('varnish'),
    varnish_admin = new varnish.Admin(config.varnish.host, config.varnish.port, {file: config.varnish.secret_file});

console.log('Subscribe to Redis channel.');
redis_client.subscribe(config.redis.channel);

console.log('Listening for Redis messages.');
redis_client.on("message", function (channel, message) {

  var routes = (JSON.parse(message)).routes;

  if (routes.length) {

    for (i = 0; i < routes.length; i++) {

      console.log('ban.url ' + routes[i]);

      varnish_admin.send('ban.url ' + routes[i], function(err, resp){
        if(err) return console.log('Varnish command failed');
        console.log('Varnish response ' + resp);
      });

    }

  }
});
