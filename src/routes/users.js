'use strict';

var express = require('express');
var debug = require('debug')('elearning-users');
var userDAO = require('../dao/mysql/userdao');
var redis = require('../helpers/redis');
var session = require('../helpers/session');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('No user found.');
});

router.get('/:id', function(req, res) {
    let id = req.params.id;
    userDAO.findById(req.params.id, function(error, users) {
        if (error) {
            debug('Error while executing userDAO.findById(%d): %s.', id, JSON.stringify(error));
            res.send('Could not get user with id \"' + id + '\", please try again.');
        } else {
            debug('userDAO.findById(%d) completed without error, users: %s.', id, JSON.stringify(users));
            if (Array.isArray(users)) {
                if (users.length == 1) {
                    res.send(JSON.stringify(users[0]));
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
        res.status(400).send();
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
        portrait: reqUser.portrait
    };
    userDAO.createUser(userInfo, function(error, user) {
        if (error) {
            let errors = error.errors;
            let errorMsg;
            if (Array.isArray(errors) && errors.length > 0) {
                errorMsg = errors[0].message;
            } else if (error.parent && error.parent.sqlMessage) {
                errorMsg = error.parent.sqlMessage;
            } else {
                errorMsg = JSON.stringify(error);
            }
            debug('Error while executing userDAO.createUser: %s.', errorMsg);
            res.send(JSON.stringify({
                resultCode: 1,
                errorMessage: errorMsg
            }));
        } else {
            debug('userDAO.createUser completed without error, user %s.', JSON.stringify(user));
            let response = {
                resultCode: 0,
                userId: user.id
            };
            if (req.body.login_on_success) {
                let sessionId = session.generateSessionIdForUser(user);
                redis.set(sessionId, JSON.stringify({
                    userId: user.id
                }), function(error, result) {
                    debug('Setting session ID (%s) to redis completed, error: %s, result: %s', sessionId, JSON.stringify(error), JSON.stringify(result));
                });
                response.sessionId = sessionId;
            }
            res.send(JSON.stringify(response));
        }
    });
});

module.exports = router;