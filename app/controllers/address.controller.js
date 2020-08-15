const db = require("../models");
const commonService = require('../services/common.service');
const Op = db.Sequelize.Op;
const District = db.districtAddress;
const Ward = db.wardAddress;

exports.getAllDistricts = (req, res) => {

    District.findAll()
        .then(districts => {
            res.send({ districts: districts });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
}

exports.getAllWards = (req, res) => {

    Ward.findAll()
        .then(wards => {
            res.send({ wards: wards });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving categories."
            });
        });
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
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
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
        res.status(500).send({
            message: err.message || "Some error occurred while create product."
        });
        return;
    }
}