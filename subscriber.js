var redis = require("redis"),
    redis_client = redis.createClient(),
    varnish = require('varnish'),
    varnish_admin = new varnish.Admin('127.0.0.1', 6082, {file: '/etc/varnish/secret'});

console.log('Subscribe to Redis channel.');
redis_client.subscribe("varnish:purge");

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
