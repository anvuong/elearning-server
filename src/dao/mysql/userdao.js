'use strict';

var UserDAO = require('../userdao');
var executeQuery = require('../../db/mysql/dbhelper');
var callbackHelper = require('../../helpers/callback');
var crypto = require('../../helpers/crypto');
var sequelizeInfo = require('../../helpers/sequelize');
var User = require('../../models/users')(sequelizeInfo.sequelize, sequelizeInfo.Sequelize);

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

MySQL_UserDAO.prototype.findByPhoneAndPassword = function(phone, password, callback) {
    executeQuery('SELECT * FROM users WHERE phone = \'' + phone + '\' AND password = \'' + password + '\'', function(error, users) {
        callbackHelper.triggerCallback(callback, error, users);
    });
};

MySQL_UserDAO.prototype.findByEmailAndPhoneAndPassword = function(email, phone, password, callback) {
    executeQuery('SELECT * FROM users WHERE email = \'' + email + '\' AND phone = \'' + phone + '\' AND password = \'' + password + '\'', function(error, users) {
        callbackHelper.triggerCallback(callback, error, users);
    });
};

MySQL_UserDAO.prototype.createUser = function(info, callback) {
    if (!info) {
        return;
    }
    let password = info.password;
    if (password) {
        info.password = crypto.sha256(password);
    }
    let user = User.build(info);
    user.save()
        .then(function(user) {
            callbackHelper.triggerCallback(callback, null, user);
        })
        .catch(function(error) {
            callbackHelper.triggerCallback(callback, error);
        });
}

module.exports = new MySQL_UserDAO();