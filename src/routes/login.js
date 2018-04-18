'use strict';

var express = require('express');
var debug = require('debug')('elearning-login');
var userDAO = require('../dao/mysql/userdao');
var crypto = require('../helpers/crypto');
var redis = require('../helpers/redis');
var stringifier = require('../helpers/stringifier');
var session = require('../helpers/session');
var config = require('../config')();

var router = express.Router();

router.post('/', function(req, res, next) {
    if (!req.body.loginType) {
        req.body.loginType = 'system';
    }
    next();
});

router.get('/', function(req, res) {
    res.send('Login page');
});

router.post('/', function(req, res) {
    let email = req.body.email;
    let phone = req.body.phone;
    if (!email && !phone) {
        res.status(400).send(stringifier.stringify({
            message: 'No email and phone in request.'
        }));
        return;
    }
    let loginType = req.body.loginType;
    let callback = function(error, users) {
        let requestId = req.id;
        let errorMsg = stringifier.stringify(error);
        debug('Request ID: %s, loginType: %s, finding user completed, error: ', requestId, loginType, errorMsg);
        if (error) {
            res.send(stringifier.stringify({
                resultCode: 1,
                errorMessage: config.mode === 'production' ? 'Login failed because of an error. Request ID: ' + requestId : errorMsg
            }));
        } else if (Array.isArray(users) && users.length > 0) {
            doLoginForUser(req, res, users[0]);
        } else if (loginType === 'system') {
            res.send(stringifier.stringify({
                resultCode: 1,
                errorMessage: 'No user found with the specified parameters.'
            }));
        } else {
            debug('Request ID: %s, loginType: %s, found no existing user, about to create a new one with the specified parameters...');
            let userInfo = {
                name: req.body.name,
                email: email,
                phone: phone,
                avatar: req.body.avatar
            };
            userDAO.createUser(userInfo, function (error, user) {
                errorMsg = stringifier.stringify(error);
                debug('Request ID: %s, loginType: %s, create new user completed, error: %s', requestId, loginType, errorMsg);
                if (error) {
                    res.send(stringifier.stringify({
                        resultCode: 1,
                        errorMessage: config.mode === 'production' ? 'Login failed because of an error. Request ID: ' + requestId : errorMsg
                    }));
                } else {
                    doLoginForUser(req, res, user);
                }
            });
        }
    };
    if (loginType === 'system') {
        let password = crypto.sha256(req.body.password);
        if (email && !phone) {
            userDAO.findByEmailAndPassword(email, password, callback);
        } else if (!email && phone) {
            userDAO.findByPhoneAndPassword(phone, password, callback);
        } else {
            userDAO.findByEmailAndPhoneAndPassword(email, phone, password, callback);
        }
    } else if (email) {
        userDAO.findByEmail(email, callback);
    } else {
        userDAO.findByPhone(phone, callback);
    }
});

var doLoginForUser = function(req, res, user) {
    let requestId = req.id;
    let loginType = req.body.loginType;
    let sessionId = session.generateSessionIdForUser(user);
    redis.set(sessionId, stringifier.stringify({
        userId: user.id,
        loginType: loginType
    }), function (error, result) {
        let errorMsg = stringifier.stringify(error);
        debug('Request ID: %s, loginType: %s, setting session ID (%s) to redis completed, error: %s, result: %s', requestId, loginType, sessionId, errorMsg, stringifier.stringify(result));
        if (error) {
            res.send(stringifier.stringify({
                resultCode: 1,
                errorMessage: config.mode === 'production' ? 'Login failed because of an error. Request ID: ' + requestId : errorMsg
            }));
        } else {
            res.send(stringifier.stringify({
                resultCode: 0,
                sessionId: sessionId,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    gender: user.gender,
                    birthday: user.birthday,
                    avatar: user.avatar,
                    portrait: user.portrait,
                    account_balance: user.account_balance
                }
            }));
        }
    });
};

module.exports = router;