var _ = require('underscore')
  , util = require('util')
  , redis = require('redis')
  , redisClient = redis.createClient()
  , mongoose = require('mongoose');

var generator = require('../lib/generator');
var _ = require('underscore');

_.str = require('underscore.string');
_.mixin(_.str.exports());

// @todo move to config file
var mongo = {
  Server: 'localhost',
  Db: 'fingers'
};

mongoose.connect('mongodb://' + mongo.Server + '/' + mongo.Db);
var db = mongoose.connection;
db.once('open', function callback() {
  console.log('Connected to Server: ' + mongo.Server + ', DB: ' + mongo.Db);
});
db.on('error', console.error.bind(console, 'connection error:'));

// schemas
var Table = require('../models/table.js');
var Player = require('../models/player.js');



// ------------------------
// API functions
// ------------------------

module.exports.createTable = function(req, res, next) {
  console.log('API REQUEST: createTable');

  var gameSession = generator.generateId(5, 'aA#');

  var table = new Table({
    session: gameSession,
    url: 'http://' + req.headers.host + '/m/#/' + gameSession
  });
  table.save();

  console.log(table);

  res.json(table);
};



module.exports.tableInfo = function(req, res, next) {
  console.log('API REQUEST: tableInfo - ', req.params);

  Table.findOne({ _id: req.params.tableId }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Table does not exist' });
    } else {
      res.json(table);
    }
  });
};



module.exports.tableInfoBySession = function(req, res, next) {
  console.log('API REQUEST: tableInfoBySession - ', req.params);

  Table.findOne({ session: req.params.sessionId }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Table session does not exist' });
    } else {
      res.json(table);
    }
  });
};



module.exports.joinTable = function(req, res, next) {
  console.log('API REQUEST: joinTable - ', req.body);

  // check if player already exists
  Player.findOne({ name: req.body.name }, function(err, existingPlayer) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error joining table' });
    } else if (existingPlayer === null) {
      // player does not exist, create new player
      console.log('Creating new player: ' + req.body.name);
      var player = new Player({
        name: req.body.name,
        currentGameSession: req.body.sessionId // @todo can only join one game at a time
      });
      player.save();
      console.log(player);

      // @todo update game table
      Table.findOne({ session: req.body.sessionId }, function(err, table) {
        if (err) {
          console.log(err);
          res.json({ error: 'Error updating table'});
        } else if (table === null) {
          console.log('Table doesn\'t exist by session: ' + req.body.sessionId);
          res.json({ error: 'Table doesn\'t exist by session' });
        } else {
          console.log('Updating table with player');
          var players = table.get('players');
          console.log('***', players);
          console.log('player: ', player);
          players.push({ id: player.id, name: player.name });
          console.log('new players: ', players);
          table.set('players', players);
          table.save();
        }
      });

      res.json(player);
    } else {
      // player already exists, return existing player
      console.log('Found existing player: ', existingPlayer);
      // @todo update lastJoined property
      // @todo update current game session if empty
      //if (existingPlayer.currentGameSession && existingPlayer.currentGameSession !== req.body.sessionId) {
      if (false) {
        console.log('Player is already in another game');
        res.json({ error: 'Player is already in another game' });
      } else {
        // update player's game session
        console.log('updating current game session: ' + req.body.sessionId);
        existingPlayer.set('currentGameSession', req.body.sessionId);
        existingPlayer.save();
        // update table's player list
        Table.findOne({ session: req.body.sessionId }, function(err, table) {
        if (err) {
          console.log(err);
          res.json({ error: 'Error updating table'});
        } else if (table === null) {
          console.log('Table doesn\'t exist by session: ' + req.body.sessionId);
          res.json({ error: 'Table doesn\'t exist by session' });
        } else {
          console.log('Updating table with player (existing player)');
          var players = table.get('players');
          players.push({ id: existingPlayer.id, name: existingPlayer.name });
          table.set('players', players);
          table.save();
        }
      });

        res.json(existingPlayer);
      }
    }
  });
};

/**
 * leave table
 * @param name
 *
 * @requestType POST
 */
module.exports.leaveTable = function(req, res, next) {
  console.log('API REQUEST: leaveTable -', req.params);

  var name = req.name;

  res.json({
    result: 'success'
  });

  // @todo trigger notification
};


/**
 * returns player info
 * @param name
 *
 * @requestType GET
 */
module.exports.playerInfo = function(req, res, next) {
  console.log('API REQUEST: playerInfo - ', req.params);

  Player.findOne({ name: req.params.playerName }, function(err, existingPlayer) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error getting player info' });
    } else if (existingPlayer === null) {
      // player does not exist
      console.log('Player does not exist: ' + req.params.playerName);
      res.json({ error: 'Player does not exist' });
    } else {
      // found player
      console.log('Found player: ', existingPlayer);
      res.json(existingPlayer);
    }
  });

};


module.exports.playerInfoBySession = function(req, res, next) {
  console.log('API REQUEST: playerInfoBySession - ', req.params);

  Player.findOne({ name: req.params.playerName, currentGameSession: req.params.sessionId }, function(err, existingPlayer) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error getting player info by session' });
    } else if (existingPlayer === null) {
      // player does not exist
      console.log('Player does not exist or is not in a current game session: ' + req.params.playerName);
      res.json({ error: 'Player does not exist or is not in a game' });
    } else {
      // found player
      console.log('Found player: ', existingPlayer);
      res.json(existingPlayer);
    }
  });
};

/**
 * submits player move
 * @param name
 *
 * @requestType POST
 */
module.exports.playMove = function(req, res, next) {
  console.log('API REQUEST: playMove - ', req.body);

  var tableId = req.body.tableId;
  var playerName = req.body.playerName;
  var playerMove = req.body.playerMove;

  Table.findOne({ id: tableId }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error getting table' });
    } else if (table === null) {
      // table does not exist
      console.log('Table does not exist: ' + tableId);
      res.json({ error: 'PTable does not exist' });
    } else {

    }
  });

  // var multi = redisClient.multi();

  // multi.hgetall('table:' + tableId);
  // multi.smembers('table:' + tableId + ':players');
  // multi.exists(tableMovesQueue);

  // multi.exec(function(err, replies) {
  //   console.log('first multi:', replies);
  //   // trust that the table we are looking for is there
  //   var tableStats = replies[0];
  //   var playerKeys = replies[1];
  //   var movesExist = replies[2];

  //   var moveMax = playerKeys.length;

  //   var multi = redisClient.multi();

  //   // if there are no moves already current, create a new hash that is current
  //   // if (movesExist === 0) {
  //   //   multi.hset(tableMovesQueue, 'playerName:' + playerMove);
  //   // }
    
  //   multi.hsetnx(tableMovesQueue, playerName, playerMove);
  //   multi.hlen(tableMovesQueue);

  //   multi.exec(function(err, replies) {
  //     var success = replies[0];
  //     var length = replies[1];

  //     if (success === 1) {
  //       // need to do something here if this is the "last" move
  //       if (length === moveMax) {
  //         // need to update table stats and change round key from current to the round number
  //         // then, trigger some game brain
  //       }

  //       res.json({
  //         success: 'Move played successfully'
  //       });

  //       // need to do something here if this is the "last" move
  //     } else {
  //       res.json({
  //         error: 'Move already played in current round'
  //       });
  //     }



  //   });

  // });

  // @todo trigger notification
};



module.exports.players = function(req, res, next) {
  console.log('API REQUEST: players - ', req.params);

  Table.findOne({ _id: req.params.tableId }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error getting players for table' });
    } else if (table === null) {
      // table does not exist for that id
      console.log('Table does not exist for id: ' + req.params.tableId);
      res.json({ error: 'Table does not exist' });
    } else {
      // found table
      console.log('Found table: ', table);
      res.json(table.players);
    }
  });
};



















/**
 * leave table
 * @param name
 *
 * @requestType POST
 */
module.exports.leaveTable = function(req, res, next) {
  console.log('API REQUEST: leaveTable');

  var name = req.name;

  res.json({
    result: 'success'
  });

  // @todo trigger notification
};

/**
 * increments player win stats
 * @param name
 * @param increment
 *
 * @requestType POST
 */
module.exports.incrementPlayerStats = function(req, res, next) {
  console.log('API REQUEST: incrementPlayerStats');

  var name = req.name
    , incrementTypes = increment
    , wins = 0
    , total = 0;

  if (typeof incrementTypes['wins'] !== 'undefined') {
    wins++;
  }
  if (typeof incrementTypes['total'] !== 'undefined') {
    total++;
  }

  res.json({
    name: name,
    wins: wins,
    total: total
  });
};


/**
 * submits player move
 * @param name
 *
 * @requestType POST
 */
module.exports.playMove2 = function(req, res, next) {
  console.log('API REQUEST: playMove');

  var tableId = req.body.tableId;
  var playerName = req.body.playerName;
  var playerMove = req.body.playerMove;

  console.log('player move:', req.body);

  var tableMovesQueue = 'table:' + tableId + ':moves:round:current';

  var multi = redisClient.multi();

  multi.hgetall('table:' + tableId);
  multi.smembers('table:' + tableId + ':players');
  multi.exists(tableMovesQueue);

  multi.exec(function(err, replies) {
    console.log('first multi:', replies);
    // trust that the table we are looking for is there
    var tableStats = replies[0];
    var playerKeys = replies[1];
    var movesExist = replies[2];

    var moveMax = playerKeys.length;

    var multi = redisClient.multi();

    // if there are no moves already current, create a new hash that is current
    // if (movesExist === 0) {
    //   multi.hset(tableMovesQueue, 'playerName:' + playerMove);
    // }
    
    multi.hsetnx(tableMovesQueue, playerName, playerMove);
    multi.hlen(tableMovesQueue);

    multi.exec(function(err, replies) {
      var success = replies[0];
      var length = replies[1];

      if (success === 1) {
        // need to do something here if this is the "last" move
        if (length === moveMax) {
          // need to update table stats and change round key from current to the round number
          // then, trigger some game brain
        }

        res.json({
          success: 'Move played successfully'
        });

        // need to do something here if this is the "last" move
      } else {
        res.json({
          error: 'Move already played in current round'
        });
      }



    });

  });

  // @todo trigger notification
};
