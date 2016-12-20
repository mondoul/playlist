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
        cache.set(envConfig.playlistCacheKey, playlists);
        cache.set(envConfig.lastUpdated, new Date().getTime());
        console.log('Cache set');
        return playlists;
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
app.put('/playlists', (req, res) => {

    setPlaylistCache().catch(err => {
        console.log(err);
        res.status(500).json('Couldn\'t cache the playlists.');
    });

});

// Retrieve the playlists data from cache
app.get('/playlists', (req, res) => {
    try {
        let playlists = cache.get(envConfig.playlistCacheKey, true);
        res.json(playlists);
    } catch (error) {
        console.log(error);
         res.json([]);
    }
});

// Catch all other incoming requests
app.all('*', (req, res) => {
    let updated = cache.get(envConfig.lastUpdated);
    res.json({ updated });
});

// initialize cache
setPlaylistCache().catch(err => console.error(err));

export default app;