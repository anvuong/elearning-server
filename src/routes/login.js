'use strict';

var express = require('express');
var debug = require('debug')('elearning-login');
var userDAO = require('../dao/mysql/userdao');
var crypto = require('../helpers/crypto');
var redis = require('../helpers/redis');
var session = require('../helpers/session');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('Login page');
});

router.post('/', function(req, res) {
    let email = req.body.email;
    let password = crypto.sha256(req.body.password);
    if (!email && !password) {
        res.status(400).send();
        return;
    }
    userDAO.findByEmailAndPassword(email, password, function(error, users) {
        if (error) {
            debug('Error while executing userDAO.findByEmailAndPassword(%s, %s): %s.', email, password, JSON.stringify(error));
            res.status(401).send();
        } else {
            debug('userDAO.findByEmailAndPassword(%s, %s) completed without error, users: %s.', email, password, JSON.stringify(users));
            if (Array.isArray(users)) {
                if (users.length > 0) {
                    let user = users[0];
                    let sessionId = session.generateSessionIdForUser(user);
                    redis.set(sessionId, JSON.stringify({
                        userId: user.id
                    }), function(error, result) {
                        debug('Setting session ID (%s) to redis completed, error: %s, result: %s', sessionId, JSON.stringify(error), JSON.stringify(result));
                    });
                    res.send(JSON.stringify({
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
                    return;
                }
            }
            res.status(401).send();
        }
    });
});

module.exports = router;