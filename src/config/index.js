'use strict';

var config = {
    development: {
        mode: 'development',
        port: 3000,
        db: {
            host: 'localhost',
            port: 3306,
            name: 'elearning',
            user: 'root',
            password: 'wae'
        }
    },
    production: {
        mode: 'production',
        port: 5000,
        db: {
            host: 'localhost',
            port: 3306,
            name: 'elearning',
            user: 'root',
            password: 'wae'
        }
    }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'development'] || config.development;
};