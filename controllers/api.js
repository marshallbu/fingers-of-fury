/**
 * API stubbed out with fake data
 */
var _ = require('underscore')
  , util = require('util')
  , redis = require('redis')
  , redisClient = redis.createClient();


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
  redisClient.setnx('table:' + tableId, data);
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
    var tableId = 'table:' + resp;

    // table statistics
    var tableStats = {
      id: resp.toString(),
      created: Date.now().toString(),
      players: [],
      rounds: "0",
      winner: ""
    };
    console.log(tableStats);
    console.log(JSON.stringify(tableStats));
    console.log(JSON.parse(JSON.stringify(tableStats)));

    // use hmset instead?
    redisClient.set(tableId, JSON.stringify(tableStats));

    res.json({
      id: tableId
    });
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

  var tableId = req.tableId;
  var tableStats;
  var players = [];

  redisClient.get('table:' + tableId, function (err, resp) { // use hgetall instead?
    console.log(resp);
    console.log(JSON.parse(resp));
    console.log(util.inspect(JSON.parse(resp)));
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
      //tableStats = JSON.parse(resp);
      tableStats = resp;

      res.json({
        id: tableStats.id,
        created: tableStats.created,
        players: players,
        winner: tableStats.winner,
        round: tableStats.rounds
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

  var tableId = req.tableId
    , name = req.name;

  var player = {
    name: name,
    wins: 0,
    total: 0,
    state: 'undecided',
    table: tableId
  };

  redisClient.get('table:' + tableId + ':player:' + name, function (err, resp) {
    if (resp === null) {
      redisClient.set('table:' + tableId + ':player:' + name, player);
      redisClient.get('table:' + tableId, function (err, resp) {
        resp.players.push(name); // check for unique player
        self._updateTableStats(resp);
      });
    } else {
      res.json({
        error: 'Player already exists at table ' + tableId
      });
    }
  });

  var players = [];

  res.json({
    players: players
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