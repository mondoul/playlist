'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getPlaylists = getPlaylists;

var _vimeo = require('vimeo');

var _config = require('../config');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var envConfig = (0, _config.getConfig)();
var lib = new _vimeo.Vimeo(envConfig.vimeo.clientId, envConfig.vimeo.clientSecret, envConfig.vimeo.accessToken);

function getPlaylists() {

    return new Promise(function (resolve, reject) {
        getAlbums().then(function (albumResults) {
            var albumsData = [];
            var albums = [];
            albumResults.forEach(function (a) {
                // prepare album data
                albums.push({
                    name: a.name,
                    description: a.description,
                    id: a.albumId,
                    items: []
                });

                // Get videos from each albums
                albumsData.push(getAlbumVideos(a.albumId));
            });

            Promise.all(albumsData).then(function (results) {
                results.forEach(function (albumVideos) {
                    var _albums$find$items;

                    var albumId = albumVideos[0].albumId;
                    var videos = albumVideos.map(function (video, i) {
                        return {
                            order: i + 1,
                            title: video.title,
                            description: video.description,
                            video: video.videoLink,
                            thumbnail: video.thumbnail
                        };
                    });

                    (_albums$find$items = albums.find(function (a) {
                        return a.id === albumId;
                    }).items).push.apply(_albums$find$items, _toConsumableArray(videos));
                });

                resolve(albums);
            }).catch(function (err) {
                reject(err);
            });
        }).catch(function (err) {
            reject(err);
        });
    });
}

var getAlbums = function getAlbums() {
    return new Promise(function (resolve, reject) {
        lib.request({
            method: 'GET',
            path: '/me/albums'
        }, function (error, body) {
            if (error) {
                reject(error);
            } else {
                var albums = body.data.map(function (album) {
                    var albumId = album.uri.substr(album.uri.lastIndexOf('/') + 1);
                    return {
                        name: album.name,
                        description: album.description,
                        albumId: albumId
                    };
                });
                resolve(albums);
            }
        });
    });
};

var getAlbumVideos = function getAlbumVideos(albumId) {
    return new Promise(function (resolve, reject) {
        lib.request({
            method: 'GET',
            path: '/me/albums/' + albumId + '/videos'
        }, function (error, body) {
            if (error) reject(error);else {
                resolve(body.data.map(function (video) {
                    var videoId = video.uri.substr(video.uri.lastIndexOf('/') + 1);
                    var thumbnail = video.pictures.sizes.find(function (s) {
                        return s.width === 640;
                    }).link;
                    var videoLink = video.files.find(function (f) {
                        return f.quality === 'hls';
                    }).link;

                    return {
                        albumId: albumId,
                        videoId: videoId,
                        thumbnail: thumbnail,
                        videoLink: videoLink,
                        title: video.name,
                        description: video.description
                    };
                }));
            }
        });
    });
};