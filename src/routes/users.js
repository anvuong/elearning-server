'use strict';

var express = require('express');
var debug = require('debug')('elearning-users');
var userDAO = require('../dao/mysql/userdao');
var redis = require('../helpers/redis');

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
    let userInfo = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        avatar: req.body.avatar,
        password: req.body.password,
        gender: req.body.gender,
        birthday: req.body.birthday,
        portrait: req.body.portrait
    };
    userDAO.createUser(userInfo, function(error, user) {
        if (error) {
            let errors = error.errors;
            if (Array.isArray(errors) && errors.length > 0) {
                debug('Error while executing userDAO.createUser: %s.', errors[0].message);
            } else if (error.parent && error.parent.sqlMessage) {
                debug('Error while executing userDAO.createUser: %s.', error.parent.sqlMessage);
            } else {
                debug('Error while executing userDAO.createUser: %s.', JSON.stringify(error));
            }
            res.send('Could not create new user, please try again.');
        } else {
            debug('userDAO.createUser completed without error, user %s.', JSON.stringify(user));
            redis.set('sessionId', "This is a session ID");
            res.send('New user created with id \"' + user.id + '\".');
        }
    });
});

module.exports = router;