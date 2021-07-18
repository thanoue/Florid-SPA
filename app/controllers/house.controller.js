const appConstant = require('../config/app.config');
const db = require("../models");
const commonService = require("../services/common.service");
const House = db.house;
const houseAvtFolderPath = appConstant.fileFolderPath.houseAvt;
const houseAvtFolderUrl = appConstant.fileFolderUrlPath.houseAvt;
const logger = require('../config/logger');

exports.create = (req, res) => {

    let avtUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaRRqckrVoyzgz-nXMIrLLYWxGbQd6wRI8Eg&usqp=CAU';

    if (req.files) {
        
        let fileName = commonService.getNewFileName(req.files.avt);

        avtfilePath = houseAvtFolderPath + fileName;

        avtUrl = houseAvtFolderUrl + fileName;

        req.files.avt.mv(avtfilePath).then(data =>{

            createHouse(req,avtUrl,res);
            
        }).catch(err => logger.error(err, res));
    }
    else{
        createHouse(req,avtUrl,res);
    }
};

function createHouse(req,avtUrl,res){

    let body =JSON.parse(req.body['application/json']);

    console.log(body);

    let house = {
        FullName: body.fullName,
        Address: body.address,
        OwnerId: body.ownerId,
        ImgUrl: avtUrl,
        PhoneNumber : req.body.phoneNumber
    }

    House.create(house).then(newHouse => {
        res.send(newHouse);
    }).catch(err => logger.error(err, res));
}

