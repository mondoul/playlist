'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _errorhandler = require('errorhandler');

var _errorhandler2 = _interopRequireDefault(_errorhandler);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _vimeoService = require('./services/vimeoService');

var _nodeCache = require('node-cache');

var _nodeCache2 = _interopRequireDefault(_nodeCache);

var _config = require('./config');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var envConfig = (0, _config.getConfig)();
var app = (0, _express2.default)();
var cache = new _nodeCache2.default({ checkperiod: 0 });

var setPlaylistCache = function setPlaylistCache() {
    return (0, _vimeoService.getPlaylists)().then(function (playlists) {
        cache.set(envConfig.playlistCacheKey, playlists);
        cache.set(envConfig.lastUpdated, +new Date());
        console.log('Cache set');
        return playlists;
    });
};

app.use((0, _morgan2.default)('combined'));
app.use((0, _cors2.default)());
app.use((0, _errorhandler2.default)({ dumpExceptions: true, showStack: true }));

app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));

// static content delivery for documentation
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

// Set the playlists data in cache
app.put('/playlists', function (req, res) {

    setPlaylistCache().catch(function (err) {
        console.log(err);
        res.status(500).json('Couldn\'t cache the playlists.');
    });
});

// Retrieve the playlists data from cache
app.get('/playlists', function (req, res) {
    try {
        var playlists = cache.get(envConfig.playlistCacheKey, true);
        res.json(playlists);
    } catch (error) {
        console.log(error);
        res.json([]);
    }
});

// Catch all other incoming requests
app.all('*', function (req, res) {
    var updated = cache.get(envConfig.lastUpdated);
    res.json({ updated: updated });
});

// initialize cache
setPlaylistCache().catch(function (err) {
    return console.error(err);
});

exports.default = app;