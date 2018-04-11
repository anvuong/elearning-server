'use strict';

var debug = require('debug')('elearning-redis');
var redis = require('redis');
var config = require('../config')();
var callbackHelper = require('./callback');

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
        this.buffer.push({'key': key, 'value': value, 'callback': callback});
    }
};

RedisHelper.prototype.retrySettingKeysValues = function() {
    if (!this.isAuthenticated || !Array.isArray(this.buffer)) {
        return;
    }
    while (this.buffer.length > 0) {
        let item = this.buffer.shift();
        if (!item) {
            continue;
        }
        this.set(item.key, item.value, item.callback);
    }
};

RedisHelper.prototype.notifySettingKeysValuesFailed = function(error) {
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
    if (config.redis.password) {
        redisHelper.isAuthenticated = false;
        redisClient.auth(config.redis.password, function(error, result) {
            debug('Redis authentication completed with error: %s, result: %s', JSON.stringify(error), JSON.stringify(result));
            if (error) {
                redisHelper.authError = error;
                redisHelper.notifySettingKeysValuesFailed(error);
            } else {
                redisHelper.isAuthenticated = true;
                redisHelper.retrySettingKeysValues();
            }
        });
    } else {
        debug('Redis not protected by credentials, no need for authentication.');
        redisHelper.isAuthenticated = true;
        redisHelper.retrySettingKeysValues();
    }
});

redisClient.on('error', function(error) {
    debug('Redis error: %s', JSON.stringify(error));
    redisHelper.initError = error;
    redisHelper.isAuthenticated = false;
    redisHelper.notifySettingKeysValuesFailed(error);
});

module.exports = redisHelper;
