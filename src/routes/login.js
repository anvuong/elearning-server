'use strict';

var express = require('express');
var debug = require('debug')('elearning-login');
var userDAO = require('../dao/mysql/userdao');
var crypto = require('../helpers/crypto');
var redis = require('../helpers/redis');
var session = require('../helpers/session');
var config = require('../config')();

var router = express.Router();

router.get('/', function(req, res) {
    res.send('Login page');
});

router.post('/', function(req, res) {
    let email = req.body.email;
    let phone = req.body.phone;
    if (!email && !phone) {
        res.status(400).send(JSON.stringify({
            message: 'No email and phone in request.'
        }));
        return;
    }
    let password = crypto.sha256(req.body.password);
    let callback = function(error, users) {
        let requestId = req.id;
        let errorMsg = JSON.stringify(error);
        debug('Request ID: %s, finding user completed, error: ', requestId, errorMsg);
        if (error) {
            res.send(JSON.stringify({
                resultCode: 1,
                errorMessage: config.mode === 'production' ? 'Login failed because of an error. Request ID: ' + requestId : errorMsg
            }));
        } else if (Array.isArray(users) && users.length > 0) {
            let user = users[0];
            let sessionId = session.generateSessionIdForUser(user);
            redis.set(sessionId, JSON.stringify({
                userId: user.id
            }), function(error, result) {
                errorMsg = JSON.stringify(error);
                debug('Request ID: %s, setting session ID (%s) to redis completed, error: %s, result: %s', requestId, sessionId, errorMsg, JSON.stringify(result));
                if (error) {
                    res.send(JSON.stringify({
                        resultCode: 1,
                        errorMessage: config.mode === 'production' ? 'Login failed because of an error. Request ID: ' + requestId : errorMsg
                    }));
                } else {
                    res.send(JSON.stringify({
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
        } else {
            res.send(JSON.stringify({
                resultCode: 1,
                errorMessage: 'No user found with the specified parameters.'
            }));
        }
    };
    if (email && !phone) {
        userDAO.findByEmailAndPassword(email, password, callback);
    } else if (!email && phone) {
        userDAO.findByPhoneAndPassword(phone, password, callback);
    } else {
        userDAO.findByEmailAndPhoneAndPassword(email, phone, password, callback);
    }
});

module.exports = router;