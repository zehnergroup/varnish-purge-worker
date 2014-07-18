var fs = require('fs'),
    config = fs.readFileSync('./config.json'),
    chalk = require('chalk'),
    info = chalk.green,
    warn = chalk.yellow,
    debug = chalk.blue,
    error = chalk.red;

console.log( info('Loading configuration from file.') );
try {
  config = JSON.parse(config);
} catch (err) {
  console.log( error('There has been an error parsing the configuration file (config.json).') );
  console.log( warn('' + err) );
  process.exit(1);
}

var redis = require("redis"),
    redis_client = redis.createClient(config.redis.port, config.redis.host),
    varnish = require('varnish'),
    varnish_admin = new varnish.Admin(config.varnish.host, config.varnish.port, {file: config.varnish.secret_file});

console.log( info('Subscribe to Redis channel.') );
redis_client.subscribe(config.redis.channel);

console.log( info('Listening for Redis messages.') );
redis_client.on("message", function (channel, message) {

  var routes = (JSON.parse(message)).routes;

  if (routes.length) {

    for (i = 0; i < routes.length; i++) {

      console.log( debug('ban.url ' + routes[i]) );

      varnish_admin.send('ban.url ' + routes[i], function(err, resp){
        if(err) return console.log( error('Varnish command failed') );
        console.log( debug('Varnish response ' + resp) );
      });

    }

  }
});
