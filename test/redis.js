var redis = require('redis');
var redisClient = redis.createClient();

redisClient.smembers('table:2:players', function(err, resp) {
  console.log(resp);
  console.log(resp.length);

  // redisClient.end();
});

