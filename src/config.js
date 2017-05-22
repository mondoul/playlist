const config = {
    local: {
        httpPort: 3001,
        playlistCacheKey: 'vimeo-playlist-data',
        lastUpdated: 'last-updated-timestamp',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'whM2szzzGKxTh4m0WvqCcqGnT52r6e+hz3h02xEaaHc6eUYPS1Gtr7jKtxQKfrpOonYfAYMQVedGnvdULfdrvQgNaEKhCjuPqTWvdfM0koXJi0hYKSSnreS+o/wvaSob',
            accessToken: 'f6fc1b2326e32bac759cd7f53dc225fd'
        }
    },
    production: {
        httpPort: process.env.PORT,
        playlistCacheKey: 'vimeo-playlist-data',
        lastUpdated: 'last-updated-timestamp',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'whM2szzzGKxTh4m0WvqCcqGnT52r6e+hz3h02xEaaHc6eUYPS1Gtr7jKtxQKfrpOonYfAYMQVedGnvdULfdrvQgNaEKhCjuPqTWvdfM0koXJi0hYKSSnreS+o/wvaSob',
            accessToken: 'f6fc1b2326e32bac759cd7f53dc225fd'
        }
    }
};

export function getConfig() {
    return config[getEnvironment()];
}

export function getEnvironment() {
    return process.env.NODE_ENV || 'local';
}