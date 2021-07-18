const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const logger = require('../config/logger');
const https = require('https');
const { OAuth2Client } = require('google-auth-library');
const ANDROID_GOOGLE_CLIENT_ID = '840849713145-99mbcnnl6nra282nsj0a361lraebi1rk.apps.googleusercontent.com';    
const IOS_GOOGLE_CLIENT_ID = '840849713145-627cs6vkefmd1mp82it04l6q4pjihvd5.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECERT = 'oxkrbmlrhW1tgfRJMx14RrKJ';
const GOOGLE_CALLBACK_URL = 'https://di-cho.xyz/auth/google/callback';

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    // Save User to Database
    User.create({
        FullName: req.body.fullName,
        Email: req.body.email,
        Password: bcrypt.hashSync(req.body.password, 8),
        PhoneNumber: req.body.phoneNumber,
        AvtUrl: 'https://cdn1.vectorstock.com/i/thumb-large/95/10/bald-man-with-mustache-in-business-suit-ico-vector-1979510.jpg',
    })
        .then(user => {
            res.send({ user: user});
        })
        .catch(err => logger.error(err, res));
};

exports.signout = (req, res) => {
    res.send({ message: "User was logged out!" });
}

exports.loginByFacebook = (req,res)=>{
    
    let facebookToken = req.body.token;

    const options = {
        hostname: 'graph.facebook.com',
        port: 443,
        path: '/me?access_token=' + facebookToken,
        method: 'GET'
      }
    
      const request = https.get(options, response => {

        response.on('data', function (userData) {

          facebookUser = JSON.parse(userData.toString());

          User.findOne({
                    where:{
                        FacebookId:facebookUser.id
                    }
                }).then((oldUser)=>{
            
                    if(oldUser){

                        GenerateTokenAndSend(oldUser,false,res);
            
                    }else{
                   
                        User.create({
                            FullName: facebookUser.name,
                            FacebookId: facebookUser.id,
                        }).then(newUser=>{
                            
                            GenerateTokenAndSend(newUser,true,res);
                   
                        });
                    }
            
                }).catch(err =>{ 
                    res.status(401).send(err)
                });
        });

      })
    
      request.on('error', (message) => {
          res.status(401).send(message)
      });
    
      request.end();
}

exports.loginByGoogle = (req,res)=>{

    console.log(req.body.token);

    let clientId = req.body.type == 'IOS' ? IOS_GOOGLE_CLIENT_ID  : ANDROID_GOOGLE_CLIENT_ID ;

    verifyGoogleToken(req.body.token,clientId).then(googleUser => {

        console.log(googleUser); // Token is valid, do whatever you want with the user 

        User.findOne({
            where:{
                GoogleId:googleUser.sub
            }
        }).then((oldUser)=>{
    
            if(oldUser){

                GenerateTokenAndSend(oldUser,false,res);
    
            }else{

                var fullName = googleUser.given_name ? googleUser.given_name : '' + ' ' + googleUser.family_name ? googleUser.family_name : '';
           
                User.create({
                    GoogleId: googleUser.sub,
                    Email:googleUser.email,
                    AvtUrl:googleUser.picture,
                    FullName: fullName
                }).then(newUser=>{
                    
                    GenerateTokenAndSend(newUser,true,res);
           
                }).catch(err =>{ 
                    console.log('DB error:' ,err);
                    res.status(401).send(err)
                });
            }
    
        }).catch(err =>{ 
            console.log('Google error:' ,err);
            res.status(401).send(err)
        });
        
    }).catch(err => {console.log('Google error:' ,err); res.status(401).send(err);});
}

async function verifyGoogleToken(token,clientId) {

   let googleClient = new OAuth2Client(clientId); // Replace by your client ID

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: clientId  // Replace by your client ID 
    }).catch(err => {console.log('Google error:' ,err);});
    
    const payload = ticket.getPayload();

    return payload;
  }

function GenerateTokenAndSend(user, isNewUser,res){

    var token = jwt.sign({ id: user.Id }, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    var expire = new Date();

    expire.setDate(expire.getDate() +1);

    res.status(200).send({
        id: user.Id,
        fullName: user.FullName,
        email: user.Email,
        accessToken: token,
        avtUrl: user.AvtUrl,
        phoneNumber: user.PhoneNumber,
        isNewUser:isNewUser,
        expireTimeMilisecond: Date.parse(((expire).toUTCString()))
    });
}

exports.loginByEmail = (req, res) => {

    User.findOne({
        where: {
            Email: req.body.email
        }
    })
        .then(user => {

            if (!user) {
                res.status(404).send({ message: "User Not found." });
                return;
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.Password
            );

            if (!passwordIsValid) {

                res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });

                return;
            }

            var token = jwt.sign({ id: user.Id }, config.secret, {
                expiresIn: 86400 // 24 hours
            });


            res.status(200).send({
                id: user.Id,
                fullName: user.FullName,
                email: user.Email,
                accessToken: token,
                avtUrl: user.AvtUrl,
                phoneNumber: user.PhoneNumber
            });
        })
        .catch(err => logger.error(err, res));
};
