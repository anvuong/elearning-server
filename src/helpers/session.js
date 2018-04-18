'use strict';

var crypto = require('./crypto');
var stringifier = require('./stringifier');

function SessionHelper() {
}

SessionHelper.prototype.generateSessionIdForUser = function(user) {
    if (!user) {
        return;
    }
    let currentTime = (new Date()).getTime();
    return crypto.sha256(currentTime + "_" + stringifier.stringify(user));
};

module.exports = new SessionHelper();