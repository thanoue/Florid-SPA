const db = require("../models");
const District = db.districtAddress;
const Ward = db.wardAddress;
const Province = db.provinceAddress;
const logger = require('../config/logger');

exports.getAllDistricts = (req, res) => {

    District.findAll()
        .then(districts => {
            res.send({ districts: districts });
        })
        .catch(err => logger.error(err, res));
}

exports.getDistrictsByProvinceId = (req,res)=>{
    District.findAll({
        where:{
            ProvinceId: req.body.provinceId
        }
    }).then(districts => {
        res.send({ districts: districts });
    })
    .catch(err => logger.error(err, res));
}

exports.getWardsByDistrictId = (req,res)=>{
    Ward.findAll({
        where:{
            DistrictId: req.body.districtId
        }
    }).then(wards => {
        res.send({ wards: wards });
    })
    .catch(err => logger.error(err, res));
}

exports.getAllProvinces = (req, res) => {

    Province.findAll()
        .then(provinces => {
            res.send({ provinces: provinces });
        })
        .catch(err => logger.error(err, res));
}

exports.getAllWards = (req, res) => {

    Ward.findAll()
        .then(wards => {
            res.send({ wards: wards });
        })
        .catch(err => logger.error(err, res));
}

exports.addBulkDistrict = (req, res) => {
    try {
        let rawDistricts = req.body;
        let districts = [];

        rawDistricts.forEach(rawdistrict => {
            districts.push({
                Id: rawdistrict.Id,
                Name: rawdistrict.Name
            });
        });

        District.bulkCreate(districts, {
            returning: true
        }).then(data => {
            res.send({ districts: data });
        });
    }
    catch (err) {
        logger.error(err, res);
    }
}


exports.addBulkWard = (req, res) => {
    try {
        let rawWards = req.body;
        let wards = [];

        rawWards.forEach(rawdWard => {
            wards.push({
                Id: rawdWard.Id,
                Name: rawdWard.Name,
                DistrictId: rawdWard.DistrictId
            });
        });

        Ward.bulkCreate(wards, {
            returning: true
        }).then(data => {
            res.send({ districts: data });
        });
    }
    catch (err) {
        logger.error(err, res);
    }
}