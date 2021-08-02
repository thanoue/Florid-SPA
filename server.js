const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');

const app = express();

const env = process.env.NODE_ENV || 'development';

// var corsOptions = {
//     origin: [env === 'development' ? "http://localhost:4200" : ""]
// };

// app.use(cors(corsOptions));

app.use(fileUpload({
    createParentPath: true,
    limits: { fileSize: 50 * 1024 * 1024 },
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/files/user/milestones', express.static('/uploads/user/milestones'));
app.use('/files/user/avts', express.static('uploads/user/avts'));
app.use('/files/house/avts', express.static('uploads/house/avts'));
app.use('/files/trip/pictures', express.static('/uploads/trip/pictures'));

createDir('./uploads');

createDir('./uploads/user');
createDir('./uploads/user/avts');
createDir('./uploads/user/milestones');

createDir('./uploads/house');
createDir('./uploads/house/avts');

createDir('./uploads/trip');
createDir('./uploads/trip/pictures');

require('./app/routes/admin.routes')(app);

app.get('/auth/facebook/callback', function (req, res) {
    res.send("Facebook login success");
});

app.get('/auth/google/callback', function (req, res) {
    res.send("Facebook login success");
});

const db = require("./app/models/index");

db.sequelize.sync({ alter: true }).then(async () => {
    console.log('Drop and Resync Db');
    //  await initial();
    //testEncoder();
    //await initial();
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3010';
app.set('port', port);

const serverApp = http.createServer(app);

serverApp.listen(port, () => {
    console.log(`API running on host with port:${port}`);
    console.log('Env:', env);
});

function createDir(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

async function initial() {

    let info = await ytdl.getInfo('a80UUwVfUjA');


    let formats = ytdl.filterFormats(info.formats.filter(p => p.container === 'mp4'), 'videoandaudio');

    let format = ytdl.chooseFormat(formats, {
        quality: 'highest',
    });

    ytdl.downloadFromInfo(info, {
        format: format
    }).pipe(fs.createWriteStream('myvideo.mp4'))
        .on('pipe', function (src) {

            src.emit('data', function (chunk) {
                console.log(chunk);
            });

        })
        .on('finish', function () {

            console.log('completed');

        });
}

// function testEncoder() {

//     const encoder = new Lame({
//         output: "test.mp3",
//         bitrate: 192,
//     }).setFile("test.webm");

//     encoder
//         .encode()
//         .then(() => {
//             console.log('done');
//             // Encoding finished
//         })
//         .catch((error) => {
//             // Something went wrong
//             console.log(error);
//         });

// }
