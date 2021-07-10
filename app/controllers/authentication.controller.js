const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const logger = require('../config/logger');
const passport = require('passport');
const https = require('https');
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = '840849713145-99mbcnnl6nra282nsj0a361lraebi1rk.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID); // Replace by your client ID

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {

    if(!req.body.phoneNumber){
        res.status(403).send({ message: 'Phone Number is required!'});
    }
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

    verifyGoogleToken(req.body.token).then(googleUser => {

        console.log(googleUser); // Token is valid, do whatever you want with the user 

        User.findOne({
            where:{
                FacebookId:googleUser.id
            }
        }).then((oldUser)=>{
    
            if(oldUser){

                GenerateTokenAndSend(oldUser,false,res);
    
            }else{
           
                User.create({
                    FullName: googleUser.name,
                    GoogleId: googleUser.id,
                }).then(newUser=>{
                    
                    GenerateTokenAndSend(newUser,true,res);
           
                }).catch(err =>{ 
                    res.status(401).send(err)
                });
            }
    
        }).catch(err =>{ 
            res.status(401).send(err)
        });
        
    }).catch(err =>res.status(401).send(err));
}

async function verifyGoogleToken(token) {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID  // Replace by your client ID 
    });
    const payload = ticket.getPayload();
    return payload;
  }

function GenerateTokenAndSend(user, isNewUser,res){

    var token = jwt.sign({ id: user.Id }, config.secret, {
        expiresIn: 86400 // 24 hours
    });

    res.status(200).send({
        id: user.Id,
        fullName: user.FullName,
        email: user.Email,
        accessToken: token,
        avtUrl: user.AvtUrl,
        phoneNumber: user.PhoneNumber,
        isNewUser:isNewUser
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
