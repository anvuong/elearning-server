'use strict';

var crypto = require('./crypto');

function SessionHelper() {
}

SessionHelper.prototype.generateSessionIdForUser = function(user) {
    if (!user) {
        return;
    }
    let currentTime = (new Date()).getTime();
    return crypto.sha256(currentTime + "_" + JSON.stringify(user));
};

module.exports = new SessionHelper();