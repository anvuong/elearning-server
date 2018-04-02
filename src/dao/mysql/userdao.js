'use strict';

var UserDAO = require('../userdao');
var executeQuery = require('../../db/mysql/dbhelper');
var callbackHelper = require('../../helpers/callback');

function MySQL_UserDAO() {
}

MySQL_UserDAO.prototype = UserDAO.prototype;

MySQL_UserDAO.prototype.findById = function(id, callback) {
    executeQuery('SELECT * FROM users WHERE id = \'' + id + '\'', function(error, users) {
        callbackHelper.triggerCallback(callback, error, users);
    });
};

MySQL_UserDAO.prototype.findByEmailAndPassword = function(email, password, callback) {
    executeQuery('SELECT * FROM users WHERE email = \'' + email + '\' AND password = \'' + password + '\'', function(error, users) {
        callbackHelper.triggerCallback(callback, error, users);
    });
};

module.exports = new MySQL_UserDAO();