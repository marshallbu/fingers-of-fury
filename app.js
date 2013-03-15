var express = require('express');
var _ = require('underscore');
var util = require('util');
var path = require('path');
var socket = require('socket.io');

_.str = require('underscore.string');
_.mixin(_.str.exports());




var app = express();

app.use(express.static(path.join(__dirname, 'public'), {maxAge: 1000*60}));

app.listen(3000);