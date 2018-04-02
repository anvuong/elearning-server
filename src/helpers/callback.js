'use strict';

var _ = require('underscore');

function CallbackHelper() {
}

CallbackHelper.prototype.triggerCallback = function(callback, error, data) {
    if (_.isFunction(callback)) {
        callback(error, data);
    }
};

module.exports = new CallbackHelper();