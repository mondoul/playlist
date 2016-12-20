'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getConfig = getConfig;
exports.getEnvironment = getEnvironment;
var config = {
    local: {
        host: 'http://localhost:3001',
        httpPort: 3001,
        logger: 'dev',
        playlistCacheKey: 'vimeo-playlist-data',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'whM2szzzGKxTh4m0WvqCcqGnT52r6e+hz3h02xEaaHc6eUYPS1Gtr7jKtxQKfrpOonYfAYMQVedGnvdULfdrvQgNaEKhCjuPqTWvdfM0koXJi0hYKSSnreS+o/wvaSob',
            accessToken: 'cd8d36f486be1b3d792ee717fe3ac33f' //'7acca8175826793fee6d57ded5cfc051'
        },
        auth: {
            secret: 'comcast-origin-webservice',
            expires: 6000000,
            cookieSecret: 'this-is-the-cookie-secret',
            cookieName: 'auth',
            adminTenantId: 'ocsadmin',
            watcherTenantID: 'ocswatcher'
        }
    },
    development: {
        host: 'http://localhost:3001',
        httpPort: 3001,
        logger: 'dev',
        playlistCacheKey: 'vimeo-playlist-data',
        auth: {
            secret: 'comcast-origin-webservice',
            expires: 6000000,
            cookieSecret: 'this-is-the-cookie-secret',
            cookieName: 'auth',
            adminTenantId: 'ocsadmin',
            watcherTenantID: 'ocswatcher'
        }
    },
    ci: {
        host: 'http://localhost:3001',
        httpPort: 3001,
        logger: 'dev',
        playlistCacheKey: 'vimeo-playlist-data',
        auth: {
            secret: 'comcast-origin-webservice',
            expires: 6000000,
            cookieSecret: 'this-is-the-cookie-secret',
            cookieName: 'auth',
            adminTenantId: 'ocsadmin',
            watcherTenantID: 'ocswatcher'
        }
    }
};

function getConfig() {
    return config[getEnvironment()];
}

function getEnvironment() {
    return process.env.NODE_ENV || 'local';
}