const config = {
    local: {
        httpPort: 3001,
        playlistCacheKey: 'vimeo-playlist-data',
        lastUpdated: 'last-updated-timestamp',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'HUm9fgitnbjFoc3sY4wc61wkL69OhPLqtj38WO5cvSHgB0ILERUiP/9zHvEcyugWzwgvPSJUF4R1+xXkqtwEwZD3RsRhd4Bhjsav0EKQ5eX9XmQwKlx63iNzVUR0lBgB',
            accessToken: '89e944e1fbe3707a3a5db13094892e7c'
        }
    },
    production: {
        httpPort: process.env.PORT,
        playlistCacheKey: 'vimeo-playlist-data',
        lastUpdated: 'last-updated-timestamp',
        vimeo: {
            clientId: 'd446795242b03ae86ec5f935431d69e24e0d851b',
            clientSecret: 'HUm9fgitnbjFoc3sY4wc61wkL69OhPLqtj38WO5cvSHgB0ILERUiP/9zHvEcyugWzwgvPSJUF4R1+xXkqtwEwZD3RsRhd4Bhjsav0EKQ5eX9XmQwKlx63iNzVUR0lBgB',
            accessToken: '89e944e1fbe3707a3a5db13094892e7c'
        }
    }
};

export function getConfig() {
    return config[getEnvironment()];
}

export function getEnvironment() {
    return process.env.NODE_ENV || 'local';
}