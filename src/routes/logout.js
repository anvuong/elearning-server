'use strict';

var express = require('express');
var debug = require('debug')('elearning-login');
var redis = require('../helpers/redis');

var router = express.Router();

router.post('/', function(req, res) {
    let sessionId = req.body.sessionId;
    if (!sessionId) {
        res.status(400).send(JSON.stringify({
            message: 'No sessionId in request.'
        }));
        return;
    }
    redis.delete(sessionId, function(error) {
        if (error) {
            res.send(JSON.stringify({
                resultCode: 1,
                errorMessage: JSON.stringify(error)
            }));
        } else {
            res.send(JSON.stringify({
                resultCode: 0
            }));
        }
    });
});