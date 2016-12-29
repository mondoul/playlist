import express from 'express';
import errorHandler from 'errorhandler';
import path from 'path';
import cors from 'cors';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { getPlaylists } from './services/vimeoService';
import NodeCache from 'node-cache';
import { getConfig } from './config';

const envConfig = getConfig();
const app = express();
const cache = new NodeCache({ checkperiod: 0});

const setPlaylistCache = () => {
    return getPlaylists().then(playlists => {
        let updated = new Date().getTime();
        cache.set(envConfig.playlistCacheKey, playlists);
        cache.set(envConfig.lastUpdated, updated);
        console.log(`Cache set at ${updated}`);
        return { updated, playlists };
    });
};

app.use(logger('combined'));
app.use(cors());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// static content delivery for documentation
app.use(express.static(path.join(__dirname, 'public')));

// Set the playlists data in cache
app.get('/update-playlists', (req, res) => {

    setPlaylistCache()
        .then(result => {
            res.json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ updated: 0, playlists: [] });
        });

});

// Retrieve the playlists data from cache
app.get('/playlists', (req, res) => {
    try {
        let playlists = cache.get(envConfig.playlistCacheKey, true);
        let updated = cache.get(envConfig.lastUpdated, true);

        res.json({ updated, playlists });
    } catch (error) {
        console.log(error);
        res.json({ updated: 0, playlists: [] });
    }
});

// Catch all other incoming requests
app.all('*', (req, res) => {
    try {
        let updated = cache.get(envConfig.lastUpdated, true);
        res.json({ updated });
    } catch (error) {
        console.log(error);
        res.json({ updated: 0 });
    }
});

// initialize cache
setPlaylistCache().catch(err => console.error(err));

export default app;