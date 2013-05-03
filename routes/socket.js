var _ = require('underscore');
var util = require('util');
var redis = require('redis');
var redisClient = redis.createClient();

var Table = require('../models/table.js');
var Player = require('../models/player.js');

// export function for listening to the socket
module.exports = function (socket) {

  socket.on('game:player:join', function(data) {
    console.log('socket event [game:player:join]', data);

    var data = {};

    // get the latest table info and broadcast it out
    // i wonder if we should talk to our own services here?
    Table.findOne({ _id: data.tableId }, function(err, table) {
      if (err) {
        console.log(err);
        data = { 
          error: 'Table does not exist' 
        };
      } else {
        data = { 
          table: table 
        };
      }

      socket.broadcast.emit('game:player:joined', table);
    });

    
  });

  socket.on('game:player:move', function(data) {
    console.log('socket event [game:player:move]', data);

    var data = {};

    // get the latest table info and broadcast it out
    // i wonder if we should talk to our own services here?
    Table.findOne({ _id: data.tableId }, function(err, table) {
      if (err) {
        console.log(err);
        data = { 
          error: 'Table does not exist' 
        };
      } else {
        data = { 
          table: table 
        };
      }

      socket.broadcast.emit('game:player:moved', data);
    });

  });

  socket.on('disconnect', function (data) {
    console.log('socket event [disconnect]', data);

    socket.broadcast.emit('game:player:left', {
    });
  });

};