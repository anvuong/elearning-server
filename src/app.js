'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('elearning');
var config = require('./config')();
var login = require('./routes/login');
var logout = require('./routes/logout');
var users = require('./routes/users');

var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(function(req, res, next) {
    debug('Received a ' + req.method + ' request to ' + req.originalUrl);
    next();
});
app.use('/login', login);
app.use('/logout', logout);
app.use('/users', users);

app.listen(config.port, function(error) {
    if (error) {
        debug('Error occurred while creating a server listening on port %d: %s', config.port, error);
    } else {
        debug('Server is listening on port %d', config.port);
    }
});