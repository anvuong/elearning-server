'use strict';

var express = require('express');
var debug = require('debug')('elearning-users');
var userDAO = require('../dao/mysql/userdao');
var redis = require('../helpers/redis');
var session = require('../helpers/session');
var stringifier = require('../helpers/stringifier');
var config = require('../config')();

var router = express.Router();

router.get('/', function(req, res) {
    res.send('No user found.');
});

router.get('/:id', function(req, res) {
    let id = req.params.id;
    userDAO.findById(req.params.id, function(error, users) {
        if (error) {
            debug('Error while executing userDAO.findById(%d): %s.', id, stringifier.stringify(error));
            res.send('Could not get user with id \"' + id + '\", please try again.');
        } else {
            debug('userDAO.findById(%d) completed without error, users: %s.', id, stringifier.stringify(users));
            if (Array.isArray(users)) {
                if (users.length == 1) {
                    res.send(stringifier.stringify(users[0]));
                    return;
                } else if (users.length > 1) {
                    res.send('There are more than 1 user found with id \"' + id + '\".');
                    return;
                }
            }
            res.send('No user was found with id \"' + id + '\".');
        }
    });
});

router.post('/', function(req, res) {
    let reqUser = req.body.user;
    if (!reqUser) {
        res.status(400).send(stringifier.stringify({
            message: 'No user in request.'
        }));
        return;
    } else if (!reqUser.email && !reqUser.phone) {
        res.status(400).send(stringifier.stringify({
            message: 'User has no email and phone.'
        }));
        return;
    }
    let userInfo = {
        name: reqUser.name,
        email: reqUser.email,
        phone: reqUser.phone,
        avatar: reqUser.avatar,
        password: reqUser.password,
        gender: reqUser.gender,
        birthday: reqUser.birthday,
        portrait: reqUser.portrait,
        level: reqUser.level
    };
    userDAO.createUser(userInfo, function(error, user) {
        let requestId = req.id;
        if (error) {
            let errors = error.errors;
            let errorMsg;
            if (Array.isArray(errors) && errors.length > 0) {
                errorMsg = errors[0].message;
            } else if (error.parent && error.parent.sqlMessage) {
                errorMsg = error.parent.sqlMessage;
            } else {
                errorMsg = stringifier.stringify(error);
            }
            debug('Request ID: %s, error while executing userDAO.createUser: %s.', requestId, errorMsg);
            res.send(stringifier.stringify({
                resultCode: 1,
                errorMessage: config.mode === 'production' ? 'Could not create user because of an error. Request ID: ' + requestId : errorMsg
            }));
        } else {
            debug('Request ID: %s, userDAO.createUser completed without error, user %s.', requestId, stringifier.stringify(user));
            let response = {
                resultCode: 0,
                userId: user.id
            };
            if (req.body.login_on_success) {
                let sessionId = session.generateSessionIdForUser(user);
                redis.set(sessionId, stringifier.stringify({
                    userId: user.id
                }), function(error, result) {
                    let errorMsg = stringifier.stringify(error);
                    debug('Request ID: %s, setting session ID (%s) to redis completed, error: %s, result: %s', requestId, sessionId, errorMsg, stringifier.stringify(result));
                    if (error) {
                        response.resultCode = 1;
                        response.errorMessage = config.mode === 'production' ? 'Could not log in because of an error. Request ID: ' + requestId : errorMsg;
                    } else {
                        response.sessionId = sessionId;
                    }
                    res.send(stringifier.stringify(response));
                });
            } else {
                res.send(stringifier.stringify(response));
            }
        }
    });
});

module.exports = router;