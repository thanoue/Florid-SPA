const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const fs = require('fs');
const ytdl = require('ytdl-core');
const udid = require('./app/controllers/udid.controller')
const sslRedirect = require('heroku-ssl-redirect').default

var cookieParser = require('cookie-parser')
const helmet = require("helmet");

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
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.use(cookieParser(process.env.COOKIE_KEY || 'f76210bc2acc4f54af5754e15b0aab05'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.raw({
    'type': 'application/pkcs7-signature'
}))

var isProd = env != 'development';

if (isProd) {
    app.use(helmet({
        hsts: {
            preload: true,
            maxAge: 31536000,
            includeSubDomains: true
        }
    }));
}

require('./app/routes/admin.routes')(app);

app.get('/auth/facebook/callback', function (req, res) {
    res.send("Facebook login success");
});

app.get('/auth/google/callback', function (req, res) {
    res.send("Facebook login success");
});

app.use(sslRedirect(['vps'], 301));

app.get('/', udid.index);

app.post('/enroll', udid.enroll);
app.get('/enrollment', udid.enrollment);


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