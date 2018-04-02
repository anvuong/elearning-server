'use strict';

var express = require('express');
var debug = require('debug')('elearning-users');
var userDAO = require('../dao/mysql/userdao');

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

module.exports = router;