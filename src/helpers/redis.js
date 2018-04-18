'use strict';

var debug = require('debug')('elearning-redis');
var redis = require('redis');
var config = require('../config')();
var callbackHelper = require('./callback');
var stringifier = require('./stringifier');

function RedisHelper() {
}

RedisHelper.prototype.buffer;
RedisHelper.prototype.initError;
RedisHelper.prototype.authError;
RedisHelper.prototype.isAuthenticated = false;

RedisHelper.prototype.set = function(key, value, callback) {
    if (!key || !value) {
        callbackHelper.triggerCallback(callback);
        return;
    }
    if (this.initError) {
        callbackHelper.triggerCallback(callback, this.initError);
    } else if (this.authError) {
        callbackHelper.triggerCallback(callback, this.authError);
    } else if (this.isAuthenticated) {
        redisClient.set(key, value, function(error, result) {
            callbackHelper.triggerCallback(callback, error, result);
        });
    } else {
        if (!Array.isArray(this.buffer)) {
            this.buffer = new Array();
        }
        this.buffer.push({'action': 'set', 'key': key, 'value': value, 'callback': callback});
    }
};

RedisHelper.prototype.delete = function(key, callback) {
    if (!key) {
        callbackHelper.triggerCallback(callback);
        return;
    }
    if (this.initError) {
        callbackHelper.triggerCallback(callback, this.initError);
    } else if (this.authError) {
        callbackHelper.triggerCallback(callback, this.authError);
    } else if (this.isAuthenticated) {
        redisClient.del(key, function(error, result) {
            callbackHelper.triggerCallback(callback, error, result);
        });
    } else {
        if (!Array.isArray(this.buffer)) {
            this.buffer = new Array();
        }
        this.buffer.push({'action': 'delete', 'key': key, 'callback': callback});
    }
};

RedisHelper.prototype.retryActions = function() {
    if (!this.isAuthenticated || !Array.isArray(this.buffer)) {
        return;
    }
    while (this.buffer.length > 0) {
        let item = this.buffer.shift();
        if (!item) {
            continue;
        }
        if (item.action === 'set') {
            this.set(item.key, item.value, item.callback);
        } else if (item.action === 'delete') {
            this.delete(item.key, item.callback);
        }
    }
};

RedisHelper.prototype.notifyActionsFailed = function(error) {
    if (!Array.isArray(this.buffer)) {
        return;
    }
    while (this.buffer.length > 0) {
        let item = this.buffer.shift();
        if (!item) {
            continue;
        }
        callbackHelper.triggerCallback(item.callback, error);
    }
};

var redisHelper = new RedisHelper();

var redisClient = redis.createClient(config.redis);

redisClient.on('ready', function() {
    debug('Redis is ready');
    redisHelper.initError = null;
    if (config.redis.password) {
        redisHelper.authError = null;
        redisHelper.isAuthenticated = false;
        redisClient.auth(config.redis.password, function(error, result) {
            debug('Redis authentication completed with error: %s, result: %s', stringifier.stringify(error), stringifier.stringify(result));
            if (error) {
                redisHelper.authError = error;
                redisHelper.notifyActionsFailed(error);
            } else {
                redisHelper.isAuthenticated = true;
                redisHelper.retryActions();
            }
        });
    } else {
        debug('Redis not protected by credentials, no need for authentication.');
        redisHelper.isAuthenticated = true;
        redisHelper.retryActions();
    }
});

redisClient.on('error', function(error) {
    debug('Redis error: %s', stringifier.stringify(error));
    redisHelper.initError = error;
    redisHelper.isAuthenticated = false;
    redisHelper.notifyActionsFailed(error);
});

module.exports = redisHelper;
