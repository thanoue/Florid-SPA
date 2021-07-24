const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

checkDuplicateLoginName = (req, res, next) => {

    if(req.body.loginName){
    
        let ext ={};

        if(req.body.id){
            ext = {
                LoginName:req.body.loginName,
                Id:{
                    [Op.ne]:req.body.id
                }
            }
        }
        else{
            ext = {
                LoginName:req.body.loginName,
            }
        }

        User.findOne({
            where: ext
        }).then(user => {
    
            if (user) {
                res.status(400).send({
                    message: "Failed! login name is already in use!"
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
    checkDuplicateLoginName: checkDuplicateLoginName,
};

module.exports = verifySignUp;