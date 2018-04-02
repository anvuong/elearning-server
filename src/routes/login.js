'use strict';

var express = require('express');
var debug = require('debug')('elearning-login');
var userDAO = require('../dao/mysql/userdao');
var crypto = require('../helpers/crypto');

var router = express.Router();

router.get('/', function(req, res) {
    res.send('Login page');
});

router.post('/', function(req, res) {
    let email = req.body.email;
    let password = crypto.sha256(req.body.password);
    userDAO.findByEmailAndPassword(email, password, function(error, users) {
        if (error) {
            debug('Error while executing userDAO.findByEmailAndPassword(%s, %s): %s.', email, password, JSON.stringify(error));
            res.send('Login failed, please try again.');
        } else {
            debug('userDAO.findByEmailAndPassword(%s, %s) completed without error, users: %s.', email, password, JSON.stringify(users));
            if (Array.isArray(users)) {
                if (users.length == 1) {
                    res.send('Logged in successfully, user: ' + JSON.stringify(users[0]) + '.');
                    return;
                } else if (users.length > 1) {
                    res.send('Login failed because there are more than 1 user found with email \"' + email + '\" and the specified password.');
                    return;
                }
            }
            res.send('No user was found with email \"' + email + '\" and the specified password.');
        }
    });
});

module.exports = router;