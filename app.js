var express = require('express');
var app = express();
var server = require('http').createServer(app);
var controllers = require('./controllers')({verbose: true});
var _ = require('underscore');
var util = require('util');
var path = require('path');
var io = require('socket.io');

_.str = require('underscore.string');
_.mixin(_.str.exports());


io.listen(server);

// load controllers
var api = controllers.api;

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1000*60}));

// api
app.get('/api/tableInfo', api.tableInfo);
app.get('/api/playerInfo', api.playerInfo);
app.get('/api/roundResults', api.roundResults);
/*
app.post('/api/createTable', api.createTable);
app.post('/api/joinTable', api.joinTable);
app.post('/api/leaveTable', api.leaveTable);
app.post('/api/incrementPlayerStats', api.incrementPlayerStats);
app.post('/api/playMove', api.playMove);
*/
// make all requests GET for testing purposes
app.get('/api/createTable', api.createTable);
app.get('/api/joinTable', api.joinTable);
app.get('/api/leaveTable', api.leaveTable);
app.get('/api/incrementPlayerStats', api.incrementPlayerStats);
app.get('/api/playMove', api.playMove);




// app.listen(3000);
server.listen(3000);
console.log('Listening on port 3000');


