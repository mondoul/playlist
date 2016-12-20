const config = {
    local: {
        httpPort: 3001,
        playlistCacheKey: 'vimeo-playlist-data',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'whM2szzzGKxTh4m0WvqCcqGnT52r6e+hz3h02xEaaHc6eUYPS1Gtr7jKtxQKfrpOonYfAYMQVedGnvdULfdrvQgNaEKhCjuPqTWvdfM0koXJi0hYKSSnreS+o/wvaSob',
            accessToken: 'cd8d36f486be1b3d792ee717fe3ac33f'//'7acca8175826793fee6d57ded5cfc051'
        }
    },
    production: {
        httpPort: process.env.PORT,
        playlistCacheKey: 'vimeo-playlist-data',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'whM2szzzGKxTh4m0WvqCcqGnT52r6e+hz3h02xEaaHc6eUYPS1Gtr7jKtxQKfrpOonYfAYMQVedGnvdULfdrvQgNaEKhCjuPqTWvdfM0koXJi0hYKSSnreS+o/wvaSob',
            accessToken: 'cd8d36f486be1b3d792ee717fe3ac33f'//'7acca8175826793fee6d57ded5cfc051'
        }
    }
};

export function getConfig() {
    return config[getEnvironment()];
}

export function getEnvironment() {
    return process.env.NODE_ENV || 'local';
}