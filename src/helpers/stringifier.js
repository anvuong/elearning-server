'use strict';

function Stringifier() {
}

Stringifier.prototype.stringify = function(object) {
    return JSON.stringify(object, function(key, value) {
        if (value instanceof Error) {
            let error = {};
            Object.getOwnPropertyNames(value).forEach(function(key) {
                error[key] = value[key];
            });
            return error;
        } else if (!value) {
            return undefined;
        } else {
            return value;
        }
    });
};

module.exports = new Stringifier();