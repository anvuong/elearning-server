'use strict';

var mysql = require('mysql');
var db = require('../../config')().db;
var callbackHelper = require('../../helpers/callback');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: db.host,
    user: db.user,
    password: db.password,
    database: db.name,
    debug: db.debug
});

module.exports = function(query, callback) {
    pool.getConnection(function(error, connection) {
        if (error) {
            callbackHelper.triggerCallback(callback, error);
        } else if (!connection) {
            callbackHelper.triggerCallback(callback, Error('Couldn\'t get connection to database.'));
        } else {
            connection.query(query, function(error, results) {
                connection.release();
                callbackHelper.triggerCallback(callback, error, results);
            });
            connection.on('error', function(error) {
                callbackHelper.triggerCallback(callback, error);
            });
        }
    });
};