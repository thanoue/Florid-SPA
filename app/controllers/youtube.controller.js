const ytdl = require('ytdl-core');
var search = require('youtube-search');

exports.getDownloadUrls = (req, res) => {

    let src = req.body.src;

    ytdl.getInfo(src).then(infos => {

        try {
            let formats = ytdl.filterFormats(infos.formats, 'videoandaudio');
            let audioFormats = ytdl.filterFormats(infos.formats, 'audioonly');

            let audioData = [];
            let videoData = [];
            let relatedVideos = [];

            let vidInfo = {
                id: infos.player_response.videoDetails.videoId,
                title: infos.player_response.videoDetails.title,
                author: infos.player_response.videoDetails.author,
                authorId: infos.player_response.videoDetails.channelId,
                description: infos.player_response.videoDetails.shortDescription,
                thumbnails: infos.player_response.videoDetails.thumbnail.thumbnails,
            }

            infos.related_videos.forEach(relatedVideo => {

                relatedVideos.push({
                    id: relatedVideo.id,
                    title: relatedVideo.title,
                    published: relatedVideo.published,
                    author: relatedVideo.author,
                    thumbnails: relatedVideo.thumbnails,
                    lengthSeconds: relatedVideo.length_seconds,
                    viewCount: relatedVideo.view_count,
                    shortViewCountText: relatedVideo.short_view_count_text
                })
            });


            formats.forEach(format => {

                videoData.push({
                    url: format.url,
                    quality: format.quality,
                    videoCodec: format.videoCodec,
                    bitrate: format.bitrate,
                    contentLength: format.contentLength,
                    container: format.container,
                    targetDurationSec: format.targetDurationSec,
                    qualityLabel: format.qualityLabel,
                    audioBitrate: format.audioBitrate,
                    audioChannels: format.audioChannels,
                });

            });

            audioFormats.forEach(format => {

                audioData.push({
                    url: format.url,
                    quality: format.quality,
                    videoCodec: format.videoCodec,
                    bitrate: format.bitrate,
                    contentLength: format.contentLength,
                    container: format.container,
                    targetDurationSec: format.targetDurationSec,
                    qualityLabel: format.qualityLabel,
                    audioBitrate: format.audioBitrate,
                    audioChannels: format.audioChannels,
                });

            });


            res.send({
                audios: audioData,
                videos: videoData,
                relatedVideos: relatedVideos,
                info: vidInfo
            });
        }
        catch (err) {
            res.status(500).send(err);
        }

    }).catch(err => {
        res.status(500).send(err);
    });
}

exports.searchVideos = async (req, res) => {

    var opts = {
        maxResults: req.body.maxResults,
        key: 'AIzaSyDQlyytMtymqjfiE_txI4LiTW4guVayKLw',
        pageToken: '',
        channelId: '',
        type: 'video',
        order: 'viewCount'
    };

    if (req.body.pageToken) {
        opts.pageToken = req.body.pageToken
    }

    if (req.body.channelId) {
        opts.channelId = req.body.channelId
    }

    let term = req.body.terms;

    search(term, opts, function (err, results, pageResults) {

        if (err) {
            console.log(err);
            res.status(500).send(err);
            return;
        }
        else {
            res.send({ results: results, pageInfo: pageResults });
        }

    });
}