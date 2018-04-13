'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var debug = require('debug')('elearning');
var config = require('./config')();
var crypto = require('./helpers/crypto');
var login = require('./routes/login');
var logout = require('./routes/logout');
var users = require('./routes/users');

var app = express();
app.use(bodyParser.json());         // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));
app.use(function(req, res, next) {
    if (config.mode === 'production') {
        req.id = crypto.sha256((new Date()).getTime() + '_' + req.connection.remoteAddress); // TODO: Add app.enable('trust proxy') & replace req.connection.remoteAddress with req.ip if express is running behind a proxy (like Nginx)
    }
    next();
});
app.use(function(req, res, next) {
    debug('Received a %s request to %s, request ID: %s', req.method, req.originalUrl, req.id);
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