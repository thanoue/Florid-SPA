const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
var fs = require('fs');

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


app.use('/files/user/avts', express.static('uploads/user/avts'));
app.use('/files/house/avts', express.static('uploads/house/avts'));

createDir('./uploads/user/');
createDir('./uploads/user/avts');
createDir('./uploads/house');
createDir('./uploads/house/avts');


require('./app/routes/admin.routes')(app);

app.get('/auth/facebook/callback',function(req,res){
    res.send("Facebook login success");
});

app.get('/auth/google/callback',function(req,res){
    res.send("Facebook login success");
});

const db = require("./app/models/index");

db.sequelize.sync({ alter: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
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

function initial() {

}
