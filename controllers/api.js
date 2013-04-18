/**
 * API stubbed out with fake data
 */
var _ = require('underscore')
  , util = require('util')
  , redis = require('redis')
  , redisClient = redis.createClient();
var generator = require('../lib/generator');

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


// ------------------------
// API functions
// ------------------------
/**
 * creates new table
 *
 * @requestType POST
 */
module.exports.createTable = function(req, res, next) {
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
module.exports.tableInfo = function(req, res, next) {
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
module.exports.tableInfoBySession = function(req, res, next) {
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
      console.log('blah');

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
module.exports.joinTable = function(req, res, next) {
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

  var playerKey = 'table:' + tableId + ':player:' + playerName;

  redisClient.hgetall(playerKey, function (err, resp) {
    if (resp === null) {
      // redisClient.set('table:' + tableId + ':player:' + name, player);
      redisClient.hmset(playerKey, player);

      redisClient.hgetall('table:' + tableId, function (err, resp) {
        // need to check the table number before adding new players so we don't go over 4/max
        tableStats = resp;
        redisClient.sadd(tableStats.players, playerKey);
        // _updateTableStats(tableId, tableStats); // no need to do this anymore for the time being
      });

      res.json(player);

    } else {
      res.json({
        error: 'Player already exists at table ' + tableId
      });
    }
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
module.exports.players = function(req, res, next) {
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
 * submits player move
 * @param name
 *
 * @requestType POST
 */
module.exports.playMove = function(req, res, next) {
  console.log('API REQUEST: playMove');

  var name = req.name
    , type = req.type;

  res.json({
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