var _ = require('lodash');
var path = require('path');
var util = require('util');
var mongoose = require('mongoose');
var generator = require('../lib/generator');
var QREncoder = require('qr').Encoder;
var qrencoder = new QREncoder;

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
var qrUrlPath = 'images/qr_cache';
var rootQRPath = path.join(__dirname, '../app/', qrUrlPath);


// ------------------------
// API functions
// ------------------------

module.exports.createTable = function(req, res, next) {
  console.log('API REQUEST: createTable');

  var gameSession = generator.generateId(5, 'aA#');
  var gameUrl = 'http://' + req.headers.host + '/#/' + gameSession;
  var qrImage = gameSession + '.png';
  var gameQRPath = rootQRPath + '/' + qrImage;

  qrencoder.on('end', function(){
      console.log('file saved');
  });
  qrencoder.encode(gameUrl, gameQRPath, {version: 3, level: 'M', margin: 2});

  var table = new Table({
    session: gameSession,
    url: gameUrl,
    qr_url: qrUrlPath + '/' + qrImage
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
    if (err || table === null) {
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
      if (existingPlayer.currentGameSession && existingPlayer.currentGameSession !== req.body.sessionId) {
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
  console.log('API REQUEST: leaveTable -', req.body);

  // name, table session
  // clear session from player
  Player.findOne({ name: req.body.name, currentGameSession: req.body.sessionId }, function(err, player) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error leaving table' });
    } else if (player === null) {
      // player doesn't exist
      console.log('Player does not exist: ' + req.body.name);
      res.json({ error: 'Player does not exist' });
    } else {
      player.set('currentGameSession', null);
      player.save();

      Table.findOne({ session: req.body.sessionId }, function(err, table) {
        if (err) {
          console.log(err);
          res.json({ error: 'Error finding table'});
        } else if (table === null) {
          // table doesn't exist
          console.log('Table does not exist: ' + req.body.sessionId);
          res.json({ error: 'Error finding table for session'});
        } else {
          var players = table.get('players');
          for (var i = 0; i < players.length; i++) {
            if (players[i].name === req.body.name) {
              players = players.splice(i);
              break;
            }
          }
          res.json({ players: players });
        }
      });
      // return set of players left in game
    }
  });
};


/**
 * makes judgement on a round and returns results
 * @param tableId
 * @param round
 *
 * @requestType POST
 **/
module.exports.makeJudgement = function(req, res, next) {
  console.log('API REQUEST: makeJudgement - ', req.body);

  var tableId = req.body.tableId;
  var round = req.body.round;

  //Table.findOne({ _id: tableId, 'rounds.round': round, 'rounds.complete': false }, function(err, table) {
  Table.findOne({ _id: tableId, 'rounds.complete': false }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error judging round' });
    } else if (table === null) {
      console.log('Table does not exist: ' + tableId, round);
      res.json({ error: 'Table does not exist' });
    } else {
      console.log('Found table: ', table);

      // @todo properly get the round number
      var moves = _.last(table.rounds).moves;
      var rocks = [];
      var papers = [];
      var scissors = [];
      for (var move in moves) {
        if (moves[move].move == 'rock') {
          rocks.push(moves[move].player);
        } else if (moves[move].move == 'paper') {
          papers.push(moves[move].player);
        } else if (moves[move].move == 'scissors') {
          scissors.push(moves[move].player);
        }
      }

      
      if (rocks.length > 0 && papers.length > 0 && scissors.length > 0) { // tie game
        console.log('TIE GAME');
        // update round data
        var tempRounds = table.rounds;
        var currRound = _.last(table.rounds);
        currRound.complete = true;
        tempRounds[table.rounds.length - 1] = currRound;
        table.set('rounds', tempRounds);
        table.save();

        res.json({
          result: 'draw',
          winners: [],
          table: table
        });
      } else if (rocks.length > 0 && papers.length == 0) { // rock wins
        console.log('ROCK WINS');
        // update round data
        var tempRounds = table.rounds;
        var currRound = _.last(table.rounds);
        currRound.complete = true;
        currRound.winners = rocks;
        tempRounds[table.rounds.length - 1] = currRound;
        table.set('rounds', tempRounds);
        table.save();

        res.json({
          result: 'rock wins',
          winners: currRound.winners,
          table: table
        });
      } else if (papers.length > 0 && scissors.length == 0) { // paper wins
        console.log('PAPER WINS');
        // update round data
        var tempRounds = table.rounds;
        var currRound = _.last(table.rounds);
        currRound.complete = true;
        currRound.winners = papers;
        tempRounds[table.rounds.length - 1] = currRound;
        table.set('rounds', tempRounds);
        table.save();

        res.json({
          result: 'paper wins',
          winners: currRound.winners,
          table: table
        });
      } else if (scissors.length > 0 && rocks.length == 0) { // scissor wins
        console.log('SCISSOR WINS');
        // update round data
        var tempRounds = table.rounds;
        var currRound = _.last(table.rounds);
        currRound.complete = true;
        currRound.winners = scissors;
        tempRounds[table.rounds.length - 1] = currRound;
        table.set('rounds', tempRounds);
        table.save();

        res.json({
          result: 'scissor wins',
          winners: currRound.winners,
          table: table
        });
      } else {
        console.log('what do?');
        res.json({
          result: 'error, what did u do',
          table: table
        });
      }
    }
  });
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
  var playerName = req.body.playerName; //should probably change this to player id
  var playerMove = req.body.playerMove;


  Table.findOne({ _id: tableId }, function(err, table) {
    if (err) {
      console.log(err);
      res.json({ error: 'Error getting table' });
    } else if (table === null) {
      // table does not exist
      console.log('Table does not exist: ' + tableId);
      res.json({ error: 'Table does not exist' });
    } else {

      var roundNum = table.rounds.length;

      if (roundNum === 0) {
        //create a new round when there are none
        var round = {
          winners: [],
          moves: [{ player: playerName, move: playerMove }],
          played: null,
          complete: false
        };

        table.rounds.push(round);

        table.save();

        res.json({
          success: 'Move played successfully'
        });

      } else {
        //if there are rounds, get the latest one, which should be the last one in the array
        var currentRound = table.rounds[roundNum - 1];

        //make sure this round isn't already won
        if (!currentRound.complete) {
          // check to see if player has already moved this round
          var results = _.find(currentRound.moves, function(move) {
            return move.player == playerName;
          });

          if (!results) {

            //just push the move on to the round array 
            var move = { player: playerName, move: playerMove };

            currentRound.moves.push(move);

            table.save();

            res.json({
              success: 'Move played successfully'
            });

          } else {
            // player already moved this round
            res.json({
              error: 'Move already played in current round'
            });

          }

        } else {
          //create a new round to add the move to
          var round = {
            winners: [],
            moves: [{ player: playerName, move: playerMove }],
            played: null,
            complete: false
          };

          table.rounds.push(round);

          table.save();

          res.json({
            success: 'Move played successfully'
          });

        }
      }

    }
  });

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

