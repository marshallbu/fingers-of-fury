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

/*

  var self = this;

  var tableId = req.body.tableId;
  var playerName = req.body.name;

  var player = {
    name: playerName,
    wins: 0,
    total: 0,
    state: 'undecided',
    table: tableId,
    created: Date.now().toString(),
    lastJoined: Date.now().toString()
  };

  var playersSetKey = 'table:' + tableId + ':players';
  var playerKey = 'table:' + tableId + ':player:' + playerName;

  //there is a probably a cleaner way to do this with the multi() call

  redisClient.smembers(playersSetKey, function(err, resp) {
    var playerCount = resp.length;

    if(playerCount >= 4) {

      res.json({
        error: 'playerMax',
        message: 'Max amount of players already joined ' + tableId,
        count: playerCount
      });

    } else {

      redisClient.hgetall(playerKey, function (err, resp) {
        if (resp === null) {
          // redisClient.set('table:' + tableId + ':player:' + name, player);
          redisClient.hmset(playerKey, player);

          redisClient.hgetall('table:' + tableId, function (err, resp) {
            // need to check the table number before adding new players so we don't go over 4/max
            tableStats = resp;
            redisClient.sadd(tableStats.players, playerKey);
            tableStats.playerCount = playerCount + 1;
            _updateTableStats(tableId, tableStats);
          });

          res.json(player);

        } else {

          res.json({
            error: 'playerAlreadyJoined',
            message: 'Player already exists at table ' + tableId
          });

        }

      });

    } //else

  });
*/
  // @todo trigger notification
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

















// -----------------------
// internal functions
// -----------------------
/**
 * returns the latest used table id
 */
var _getLatestTableId = function() {
  redisClient.get('lastTableId', function (err, resp) {
    if (resp === null) {
      redisClient.set('lastTableId', 0);
      return 0;
    } else {
      return resp;
    }
  });
}


/**
 * returns the next free table id
 */
var _getFreeTableId = function(callback) {
  redisClient.incr('lastTableId', function (err, resp) {
    callback(resp);
  });
}


/**
 * update table stats, should only be called internally
 * @param tableId
 * @param data
 *
 * @todo sanity check data
 */
var _updateTableStats = function(tableId, data) {
  console.log('PRIVATE API CALL: _updateTableStats');
  //redisClient.get('table:' + tableId, function(err, resp) {});
  // redisClient.setnx('table:' + tableId, data);

  // making this update the hash
  redisClient.hmset('table:' + tableId, data);
}

var _getPlayerCount = function(playerSetKey) {
  console.log('PRIVATE API CALL: _getPlayerCount');

  redisClient.smembers(playerSetKey, function(err, resp) {
    return resp.length;
  });
}


// ------------------------
// API functions
// ------------------------
/**
 * creates new table
 *
 * @requestType POST
 */
module.exports.createTable2 = function(req, res, next) {
  console.log('API REQUEST: createTable');

  var callback = function(resp) {
    // generate table id
    var hostname = req.headers.host;
    var tableId = 'table:' + resp;
    var session = generator.generateId(5, 'aA#');
    var tableSession = 'table:' + session;
    var tableUrl = 'http://' + hostname + '/m/#/' + session;

    // table statistics
    var tableStats = {
      id: resp.toString(),
      session: session,
      url: tableUrl,
      created: Date.now().toString(),
      // players: [], // can't have anything other than strings in a redis hash
      players: tableId + ':players', // a redis set of player keys
      playerCount: "0",
      rounds: "0",
      winner: ""
    };
    console.log(tableStats);
    // console.log(JSON.stringify(tableStats));
    // console.log(JSON.parse(JSON.stringify(tableStats)));

    // use hmset instead?
    // redisClient.set(tableId, JSON.stringify(tableStats));
    redisClient.hmset(tableId, tableStats);

    // also set a table session key that points to the tableId
    redisClient.set(tableSession, tableId);

    res.json(tableStats);
  };

  _getFreeTableId(callback)
}


/**
 * gets table info
 *
 * @requestType GET
 */
module.exports.tableInfo2 = function(req, res, next) {
  console.log('API REQUEST: tableInfo');

  var tableId = req.params.tableId;
  var tableStats;
  var players = [];

  // redisClient.get('table:' + tableId, function (err, resp) { // use hgetall instead?
  redisClient.hgetall('table:' + tableId, function (err, resp) {
    console.log(resp);
    // console.log(JSON.parse(resp));
    // console.log(util.inspect(JSON.parse(resp)));
    if (resp === null) {
      res.json({
        error: 'Table does not exist'
      });
    } else {
      /*
      for (var player in resp.players) { // don't use for...in
        // multi get for each player name
        console.log(player);
      }
      */
      // tableStats = JSON.parse(resp);
      tableStats = resp;

      // res.json({
      //   id: tableStats.id,
      //   created: tableStats.created,
      //   players: players,
      //   winner: tableStats.winner,
      //   round: tableStats.rounds
      // });
      res.json(tableStats);
    }
  });
};

/**
 * gets table info by session
 *
 * @requestType GET
 */
module.exports.tableInfoBySession2 = function(req, res, next) {
  console.log('API REQUEST: tableInfoBySession');

  var tableSessionId = req.params.sessionId;
  var tableId;
  var tableStats;
  var players = [];

  redisClient.get('table:' + tableSessionId, function (err, resp) { // use hgetall instead?
    console.log(resp);
    // console.log(JSON.parse(resp));
    // console.log(util.inspect(JSON.parse(resp)));
    if (resp === null) {
      res.json({
        error: 'Table session does not exist'
      });
    } else {
      tableId = resp;
      // console.log('blah');

      // get the table stats with the table id
      // this should probably get condensed with some sort of shim
      // redisClient.get(tableId, function (err, resp) { // use hgetall instead?
      redisClient.hgetall(tableId, function (err, resp) { // use hgetall instead?
        console.log(resp);
        // console.log(JSON.parse(resp));
        // console.log(util.inspect(JSON.parse(resp)));
        if (resp === null) {
          res.json({
            error: 'Table does not exist'
          });
        } else {
          /*
          for (var player in resp.players) { // don't use for...in
            // multi get for each player name
            console.log(player);
          }
          */
          // tableStats = JSON.parse(resp);
          tableStats = resp;

          // res.json({
          //   id: tableStats.id,
          //   created: tableStats.created,
          //   players: tableStats.players,
          //   winner: tableStats.winner,
          //   round: tableStats.rounds
          // });
          res.json(tableStats);
        }
      });


    }
  });
};


/**
 * joins table
 * @param tableId
 * @param name
 *
 * @requestType POST
 *
 * @todo make players unique and portable across tables
 */
module.exports.joinTable2 = function(req, res, next) {
  console.log('API REQUEST: joinTable');
  var self = this;

  var tableId = req.body.tableId;
  var playerName = req.body.name;

  var player = {
    name: playerName,
    wins: 0,
    total: 0,
    state: 'undecided',
    table: tableId,
    created: Date.now().toString(),
    lastJoined: Date.now().toString()
  };

  var playersSetKey = 'table:' + tableId + ':players';
  var playerKey = 'table:' + tableId + ':player:' + playerName;

  //there is a probably a cleaner way to do this with the multi() call

  redisClient.smembers(playersSetKey, function(err, resp) {
    var playerCount = resp.length;

    if(playerCount >= 4) {

      res.json({
        error: 'playerMax',
        message: 'Max amount of players already joined ' + tableId,
        count: playerCount
      });

    } else {

      redisClient.hgetall(playerKey, function (err, resp) {
        if (resp === null) {
          // redisClient.set('table:' + tableId + ':player:' + name, player);
          redisClient.hmset(playerKey, player);

          redisClient.hgetall('table:' + tableId, function (err, resp) {
            // need to check the table number before adding new players so we don't go over 4/max
            tableStats = resp;
            redisClient.sadd(tableStats.players, playerKey);
            tableStats.playerCount = playerCount + 1;
            _updateTableStats(tableId, tableStats);
          });

          res.json(player);

        } else {

          res.json({
            error: 'playerAlreadyJoined',
            message: 'Player already exists at table ' + tableId
          });

        }

      });

    } //else

  });

  // @todo trigger notification
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
 * get a list of players for a given table
 * @param tableId
 *
 * @requestType GET
 */
module.exports.players2 = function(req, res, next) {
  console.log('API REQUEST: players');

  var tableId = req.params.tableId;
  var playerSetKey = 'table:' + tableId + ':players';
  var players = [];

  // get the player set
  redisClient.smembers(playerSetKey, function(err, resp) {
    var playerSet = resp;
    console.log(playerSet);


    var multi = redisClient.multi();

    // for each key, push it into our players array
    playerSet.forEach(function(playerKey) {
      multi.hgetall(playerKey, function(err, resp) {
        var player = resp;
        console.log(player);
        players.push(player);
      });
    });

    multi.exec(function(err, resp) {

      console.log('what is in players:', players);
      // return the array
      res.json(players);      
    });

    
  });


  
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
 * returns player info
 * @param name
 *
 * @requestType GET
 */
module.exports.playerInfo = function(req, res, next) {
  console.log('API REQUEST: playerInfo');

  var name = req.name
    , wins = 0
    , total = 0
    , state = 'undecided';

  res.json({
    name: name,
    wins: wins,
    total: total,
    state: state
  });
};

/**
 * returns player info using the table session they are associated with
 * @param sessionId
 * @param playerName
 * 
 *
 * @requestType GET
 */
module.exports.playerInfoBySession2 = function(req, res, next) {
  console.log('API REQUEST: playerInfoBySession');

  var sessionId = req.params.sessionId;
  var playerName = req.params.playerName;
  var player;

  // var playerKey = 'table:' + tableId + ':player:' + playerName;

  redisClient.get('table:' + sessionId, function (err, resp) {
    console.log(resp);

    if (resp === null) {
      res.json({
        error: 'Table session does not exist'
      });
    } else {
      tableId = resp;

      var playerKey = tableId + ':player:' + playerName;

      redisClient.hgetall(playerKey, function (err, resp) {
        if (resp === null) {

          res.json({
            error: 'Player does not exist'
          });

        } else {

          player = resp;
          
          res.json(player);
        }

      });

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


/**
 * get the round's results
 * @param round
 *
 * @requestType POST
 */
module.exports.roundResults = function(req, res, next) {
  console.log('API REQUEST: roundResults');

  var name = req.name
    , type = req.type;

  res.json({
  });
};