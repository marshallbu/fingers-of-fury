var express = require('express');
var app = express();
var server = require('http').createServer(app);
var controllers = require('./controllers')({verbose: true});
var _ = require('lodash');
var util = require('util');
var path = require('path');
var io = require('socket.io').listen(server);
var generator = require('./lib/generator');
var socket = require('./lib/socket');

_.str = require('underscore.string');
_.mixin(_.str.exports());

// load controllers
var api = controllers.api;

app.use('/', express.static(path.join(__dirname, 'app'), {}));
app.use(express.bodyParser());

// table api
app.get('/api/tableInfo/:tableId', api.tableInfo);
app.get('/api/tableInfo/:tableId/players', api.players);
app.get('/api/tableInfoBySession/:sessionId', api.tableInfoBySession);
app.get('/api/createTable', api.createTable);
app.post('/api/joinTable', api.joinTable);
app.post('/api/leaveTable', api.leaveTable);
app.post('/api/makeJudgement', api.makeJudgement);

// player api
app.get('/api/playerInfo', api.playerInfo);
app.get('/api/playerInfoBySession/:playerName/:sessionId', api.playerInfoBySession);
app.post('/api/playMove', api.playMove);

// app.post('/api/createTable', api.createTable);

// app.post('/api/leaveTable', api.leaveTable);
// app.post('/api/incrementPlayerStats', api.incrementPlayerStats);


// make all requests GET for testing purposes

// app.get('/api/joinTable', api.joinTable);

app.get('/api/incrementPlayerStats', api.incrementPlayerStats);
// app.get('/api/playMove', api.playMove);


// app.listen(3000);
server.listen(3000);
console.log('Listening on port 3000');

// listen for socket stuff
io.sockets.on('connection', socket);
