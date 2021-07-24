const ytdl = require('ytdl-core');

exports.getDownloadUrls = (req, res) => {

   let src = req.body.src;

   ytdl.getInfo(src).then(infos =>{

    let formats = ytdl.filterFormats(infos.formats,'videoandaudio');
    let audioFormats = ytdl.filterFormats(infos.formats,'audioonly');

    let audioData = [];
    let videoData = [];

    console.log( 'format: ',formats.length);

    formats.forEach(format =>{

        videoData.push({
            url: format.url,
            quality:format.quality,
            videoCodec: format.videoCodec,
            bitrate: format.bitrate,
            contentLength: format.contentLength,
            container: format.container,
            targetDurationSec: format.targetDurationSec,
            qualityLabel:format.qualityLabel,
            audioBitrate: format.audioBitrate,
            audioChannels: format.audioChannels,
        });

    });

    audioFormats.forEach(format =>{

        audioData.push({
            url: format.url,
            quality:format.quality,
            videoCodec: format.videoCodec,
            bitrate: format.bitrate,
            contentLength: format.contentLength,
            container: format.container,
            targetDurationSec: format.targetDurationSec,
            qualityLabel:format.qualityLabel,
            audioBitrate: format.audioBitrate,
            audioChannels: format.audioChannels,
        });

    });

    

    res.send({
        audios:audioData,
        videos:videoData
    });

   });
}