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

    var tableData = {};

    // get the latest table info and broadcast it out
    // i wonder if we should talk to our own services here?
    Table.findOne({ _id: data.tableId }, function(err, table) {
      if (err) {
        console.log(err);
        tableData = { 
          error: 'Error getting Table' 
        };
      } else if (table === null) {
        console.log('Table does not exist: ' + data.tableId);
        tableData = { 
          error: 'Table does not exist' 
        };
      } else {
        tableData = { 
          table: table 
        };
      }

      socket.broadcast.emit('game:player:joined', tableData);
    });

    
  });

  socket.on('game:player:move', function(data) {
    console.log('socket event [game:player:move]', data);

    var tableData = {};

    // get the latest table info and broadcast it out
    // i wonder if we should talk to our own services here?
    Table.findOne({ _id: data.moveData.tableId }, function(err, table) {
      if (err) {
        console.log(err);
        tableData = { 
          error: 'Error getting Table' 
        };
      } else if (table === null) {
        console.log('Table does not exist: ' + data.moveData.tableId);
        tableData = { 
          error: 'Table does not exist' 
        };
      } else {
        tableData = { 
          table: table 
        };
      }

      socket.broadcast.emit('game:player:moved', tableData);
    });

  });

  socket.on('disconnect', function (data) {
    console.log('socket event [disconnect]', data);

    socket.broadcast.emit('game:player:left', {
    });
  });

};