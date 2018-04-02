'use strict';

var _ = require('underscore');
var mysql = require('mysql');
var callbackHelper = require('../../helpers/callback');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'wae',
    database: 'elearning',
    debug: false
});

module.exports = function(query, callback) {
    pool.getConnection(function(error, connection) {
        if (error) {
            callbackHelper.triggerCallback(callback, error);
        } else if (connection) {
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