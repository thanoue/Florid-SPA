const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
var bcrypt = require("bcryptjs");
// const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();

// var corsOptions = {
//     origin: "http://localhost:4200"
// };
// app.use(cors(corsOptions));

app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/file', express.static('uploads'));
app.use('/user/avt', express.static('uploads/userAvt'));
app.use('/product/img', express.static('uploads/productImg'));

require('./app/routes/admin.routes')(app);


// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const { user, role, category } = require("./app/models/index");
const db = require("./app/models/index");
db.sequelize.sync().then(() => {
    console.log('Drop and Resync Db');
    initial();
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`API running on host with port:${port}`));

function initial() {

    role.findAll()
        .then((roles) => {

            if (roles && roles.length > 0) {
                return;
            }

            let addingRoles = [
                {
                    Id: 1,
                    Name: "User"
                },
                {
                    Id: 2,
                    Name: "Shipper"
                },
                {
                    Id: 3,
                    Name: "Florist"
                }, {
                    Id: 4,
                    Name: "Account"
                }, {
                    Id: 5,
                    Name: "Admin"
                }
            ]

            role.bulkCreate(addingRoles, {
                returning: true
            }).then(res => {
                user.create({
                    FullName: 'Hà Thu Mai',
                    Email: 'thumai@florid.com',
                    LoginName: 'admin',
                    Password: bcrypt.hashSync('123456', 8),
                    PhoneNumber: '0987654321',
                    AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
                    IsPrinter: false
                }).then(user => {
                    user.setRoles([5]).then(() => {
                    });
                });

                var categories = [
                    {
                        Name: "Valentine",
                        Description: "Hoa lễ tình nhân"
                    },
                    {
                        Name: "Bó hoa tươi",
                        Description: "Bó hoa tươi"
                    },
                    {
                        Name: "Bình hoa tươi",
                        Description: "Bình hoa tươi"
                    },
                    {
                        Name: "Hộp hoa tươi",
                        Description: "Hộp hoa tươi"
                    },
                    {
                        Name: "Giỏ hoa tươi",
                        Description: "Giỏ hoa tươi"
                    },
                    {
                        Name: "Hoa nghệ thuật",
                        Description: "Hoa nghệ thuật"
                    },
                    {
                        Name: "Kệ hoa tươi",
                        Description: "Kệ hoa tươi"
                    },
                    {
                        Name: "Hoa sự kiện",
                        Description: "Hoa sự kiện"
                    },
                    {
                        Name: "Lan hồ điệp",
                        Description: "Lan hồ điệp"
                    }
                ]

                category.bulkCreate(categories, {
                    returning: true
                }).then(() => {
                    console.log('added bulk category');
                });
            });

        });
}