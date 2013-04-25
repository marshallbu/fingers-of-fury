var redis = require('redis');
var redisClient = redis.createClient();

// redisClient.smembers('table:2:players', function(err, resp) {
//   console.log(resp);
//   console.log(resp.length);

//   // redisClient.end();
// });

var multi = redisClient.multi();

multi.get('table:Mhdmp');
multi.hgetall('table:' + 27);
multi.smembers('table:27:players');

multi.exec(function (err, replies) {
  console.log(replies);
});

