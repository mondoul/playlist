import { Vimeo } from 'vimeo';
import { getConfig } from '../config';

const envConfig = getConfig();
const lib = new Vimeo(envConfig.vimeo.clientId, envConfig.vimeo.clientSecret, envConfig.vimeo.accessToken);

export function getPlaylists() {

    return new Promise((resolve, reject) => {
       getAlbums().then(albumResults => {
           let albumsData = [];
           let albums = [];
           albumResults.forEach(a => {
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

           Promise.all(albumsData).then(results => {
               results.forEach(albumVideos => {
                   let albumId = albumVideos[0].albumId;
                   let videos = albumVideos.map((video, i) => {
                       return {
                           order: i + 1,
                           title: video.title,
                           description: video.description,
                           video: video.videoLink,
                           thumbnail: video.thumbnail,
                           duration: video.duration
                       }
                   });

                   albums.find(a => a.id === albumId).items.push(...videos);
               });

               resolve(albums);

           }).catch(err => {
               reject(err);
           });

       }).catch(err => {
           reject(err);
       });
   });

}

const getAlbums = () => {
    return new Promise((resolve, reject) => {
        lib.request({
            method:'GET',
            path:'/me/albums'
        }, (error, body) => {
            if (error) {
                reject(error);
            } else {
                let albums = body.data.map(album => {
                    let albumId = album.uri.substr(album.uri.lastIndexOf('/') + 1);
                    return {
                        name: album.name,
                        description: album.description,
                        albumId
                    }
                });
                resolve(albums);
            }
        });
    });
};

const getAlbumVideos = (albumId) => {
    return new Promise((resolve, reject) => {
        lib.request({
            method: 'GET',
            path: `/me/albums/${albumId}/videos`
        }, (error, body) => {
            if (error)
               reject(error);
            else {
                resolve(body.data.map(video => {
                    let videoId = video.uri.substr(video.uri.lastIndexOf('/') + 1);
                    let thumbnail = video.pictures.sizes.find(s => s.width === 640).link;
                    let videoLink = video.files.find(f => f.quality === 'hls').link;

                    return {
                        albumId,
                        videoId,
                        thumbnail,
                        videoLink,
                        title: video.name,
                        description: video.description,
                        duration: video.duration
                    };
                }));
            }
        });
    });
};
