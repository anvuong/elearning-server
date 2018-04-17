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
            password: 'wae',
            debug: true
        },
        redis: {
            host: 'localhost',
            port: 6379
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
            password: 'wae',
            debug: false
        },
        redis: {
            host: 'localhost',
            port: 6379
        }
    }
};

module.exports = function(mode) {
    return config[mode || process.argv[2] || 'development'] || config.development;
};