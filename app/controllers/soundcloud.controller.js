const scdlCreate = require('soundcloud-downloader').create
const fs = require('fs');
const logger = require('../config/logger');
const { pipeline } = require("stream");
const CLIENT_ID = 'atcX6KFaz2y3iq7fJayIK779Hr4oGArb'

const scdl = scdlCreate({
    clientID: CLIENT_ID,
    saveClientID: false,
})

exports.searchSong = (req, res) => {
    let term = req.body.term;
    let itemCount = req.body.itemCount;
    let page = req.body.page ? req.body.page : 0;

    let offset = page * itemCount;

    scdl.search({
        limit: itemCount,
        resourceType: 'tracks',
        query: term,
        offset: offset
    }).then(data => {
        res.send(data);
    }).catch(err => logger.error(err, res));;
}

exports.getRelativedSongs = (req, res) => {

    let id = req.body.id;
    let itemCount = req.body.itemCount;
    let page = req.body.page ? req.body.page : 0;

    scdl.related(id, itemCount, page)
        .then(data => {
            res.send(data);
        }).catch(err => logger.error(err, res));;
}

exports.getFile = (req, res) => {

    scdl.download(req.query.url).then(stream => {

        pipeline(stream, res, err => {
            res.end();
        });

    })
        .catch(err => logger.error(err, res));
}