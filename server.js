const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
var bcrypt = require("bcryptjs");
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();

const env = process.env.NODE_ENV || 'development';

var corsOptions = {
    origin: [env === 'development' ? "http://localhost:4200" : "https://floridstorage.web.app", "https://floridstorage.firebaseapp.com"]
};


app.use(cors(corsOptions));

app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/file', express.static('uploads'));    
app.use('/user/avt', express.static('uploads/userAvt'));
app.use('/product/img', express.static('uploads/productImg'));
app.use('/orderDetail/resultImg', express.static('uploads/resultImg'));
app.use('/orderDetail/shippingImg', express.static('uploads/shipppingImg'));
app.use('/ios/install', express.static('uploads/ios'));

require('./app/routes/admin.routes')(app);

// // Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

const { user, role, category, customer } = require("./app/models/index");
const db = require("./app/models/index");
db.sequelize.sync({ alter: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);
    
const serverApp = http.createServer(app);

serverApp.listen(port, () => {
    console.log(`API running on host with port:${port}`);
    console.log('Env:',env );
});

const io = require('socket.io')(serverApp);
io.on('connection', (socket) => {

    socket.emit('connected');

    socket.userId = 0;
    socket.isPrinter = false;

    socket.on('doPrintJob', (data) => {

        var clients = io.sockets.clients();

        const keys = Object.keys(clients.connected);

        let isHasPrinter = false;
        keys.forEach(key => {

            let itemSocket = clients.connected[key];

            if (itemSocket.isPrinter) {
                itemSocket.emit('doPrintJob', { printJob: data.printJob });
                isHasPrinter = true;
            }
        });

        if (!isHasPrinter) {
            socket.emit('printingNoResponse');
        }

    })

    socket.on('login', (data) => {

        socket.userId = data.userId;
        socket.isPrinter = data.isPrinter;

        var clients = io.sockets.clients();

        const keys = Object.keys(clients.connected)

        keys.forEach(key => {

            let itemSocket = clients.connected[key];

            if (itemSocket.userId && itemSocket.userId == data.userId) {
                if (key != socket.id) {
                    itemSocket.emit('forceLogout', { message: 'someone has already logged in with your account!' });
                }
            }
        });
    });

});

function initial() {

    let id = 'KHACH_LE';

    customer.findOne({
        where: {
            Id: id
        }
    })
        .then((cus) => {

            if (cus) {
                return;
            }

            customer.create({
                Id: 'KHACH_LE',
                Sex: 'Male',
                FullName: 'Khách lẻ',
                BirthDay: 0,
                AccumulatedAmount: 0,
                AvailableScore: 0,
                UsedScoreTotal: 0,
                MembershipType: 'NewCustomer',
                NumberId: 0
            })
        });

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
                },
                {
                    Id: 4,
                    Name: "Account"
                },
                {
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
                    IsPrinter: false,
                    AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
                }).then(user1 => {
                    user1.setRoles([5]).then(() => {
                        user.create({
                            FullName: 'Mai Van Ba',
                            Email: 'bamai@florid.com',
                            LoginName: 'account',
                            Password: bcrypt.hashSync('123456', 8),
                            PhoneNumber: '0987654321',
                            IsPrinter: true,
                            AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
                        }).then(user2 => {
                            user2.setRoles([4]).then(() => {

                            });
                        });
                    });
                });

                var categories = [
                    {
                        Id: 1,
                        Name: "Valentine",
                        Description: "Hoa lễ tình nhân"
                    },
                    {
                        Id: 2,
                        Name: "Bó hoa tươi",
                        Description: "Bó hoa tươi"
                    },
                    {
                        Id: 3,
                        Name: "Bình hoa tươi",
                        Description: "Bình hoa tươi"
                    },
                    {
                        Id: 4,
                        Name: "Hộp hoa tươi",
                        Description: "Hộp hoa tươi"
                    },
                    {
                        Id: 5,
                        Name: "Giỏ hoa tươi",
                        Description: "Giỏ hoa tươi"
                    },
                    {
                        Id: 6,
                        Name: "Hoa cưới",
                        Description: "Hoa cưới"
                    },
                    {
                        Id: 7,
                        Name: "Hoa nghệ thuật",
                        Description: "Hoa nghệ thuật"
                    },
                    {
                        Id: 8,
                        Name: "Kệ hoa tươi",
                        Description: "Kệ hoa tươi"
                    },
                    {
                        Id: 9,
                        Name: "Hoa sự kiện",
                        Description: "Hoa sự kiện"
                    },
                    {
                        Id: 10,
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