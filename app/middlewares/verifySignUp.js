const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

checkDuplicatePhoneNumber = (req, res, next) => {

    if(req.body.phoneNumber){
    
        let ext ={};
        if(req.body.id){
            ext = {
                PhoneNumber:req.body.phoneNumber,
                Id:{
                    [Op.ne]:req.body.id
                }
            }
        }
        else{
            ext = {
                PhoneNumber:req.body.phoneNumber,
            }
        }

        User.findOne({
            where: ext
        }).then(user => {
    
            if (user) {
                res.status(400).send({
                    message: "Failed! phoneNumber is already in use!"
                });
                return;
            }
    
            next();
        });
    }else{
        next();
    }
};

const verifySignUp = {
    checkDuplicatePhoneNumber: checkDuplicatePhoneNumber,
};

module.exports = verifySignUp;