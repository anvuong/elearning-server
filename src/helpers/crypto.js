'use strict';

var sha = require('sha.js');

function CryptoHelper() {
}

CryptoHelper.prototype.sha256 = function(text) {
    return sha('sha256').update(text).digest('hex');
};

module.exports = new CryptoHelper();