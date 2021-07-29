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

            console.log('video count: ', formats.length);
            console.log('audio count: ', audioFormats.length);
            console.log('related  count: ', infos.related_videos.length);

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
                relatedVideos: relatedVideos
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
        channelId: ''
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