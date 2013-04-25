var _ = require('underscore');
var util = require('util');
var redis = require('redis');
var redisClient = redis.createClient();

// export function for listening to the socket
module.exports = function (socket) {

  socket.on('game:player:join', function(data) {
    console.log('socket event [game:player:join]', data);

    var table = {};

    // get the latest table info and broadcast it out
    // i wonder if we should talk to our own services here?
    redisClient.hgetall('table:' + data.tableId, function(err, resp) {

      if (resp === null) {
        table = {
          error: 'Table does not exist'
        };
      } else {
        table = {
          tableStats: resp
        } 
      }

      socket.broadcast.emit('game:player:joined', table);
    });

  });

  socket.on('game:player:move', function(data) {
    console.log('socket event [game:player:move]', data);

  });

  socket.on('disconnect', function () {
    socket.broadcast.emit('game:player:left', {
    });
  });

};