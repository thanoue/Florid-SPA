const express = require('express');
const saleRouter = express.Router();
const sha256 = require('js-sha256');
const { v1: uuidv1 } = require('uuid');
import * as auth from '../helper/ authorize';
import * as adminSdk from '../helper/admin.sdk';
import { Role } from '../helper/role';

const https = require('https');


// routes
saleRouter.post('/momo/qr/request', momoQRCodeRequest);
saleRouter.post('/momo/qr/confirm', auth.authorize(new Array(Role.Account, Role.Admin)), momoQRCodeConfirm)

module.exports = saleRouter;

function momoQRCodeConfirm(req: any, res: any) {

    const body = JSON.stringify({
        partnerCode: req.body.partnerCode,
        partnerRefId: req.body.partnerRefId,
        requestType: 'capture',
        requestId: req.body.requestId,
        momoTransId: req.body.momoTransId,
        signature: req.body.signature
    });

    const options = {
        hostname: 'test-payment.momo.vn',
        path: '/pay/confirm',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': body.length
        }
    };

    console.log('param:', body);

    const request = https.request(options, (result: any) => {
        result.setEncoding('utf8');
        result.on('data', (bodyRes: any) => {
            if (bodyRes) {
                console.log('data ne:', bodyRes);
                res.status(200).send(bodyRes);
            } else {
                res.status(500).send('Error.');
            }
        });

        res.on('end', () => {
            console.log('No more data in response.');
        });
    })

    request.on('error', (e: any) => {
        console.log(`problem with request: ${e.message}`);
        res.status(500).send(e);
    });

    // write data to request body
    request.write(body);
    request.end();
}

function momoQRCodeRequest(req: any, res: any) {

    const status = parseInt(req.body.status_code);

    if (status === 0) {

        // const rawReqSig = `accessKey=${req.body.accessKey}&amount=${req.body.amount}&message=${req.body.message}&momoTransId=${req.body.momoTransId}
        // &partnerCode=${req.body.partnerCode}&partnerRefId=${req.body.partnerRefId}&partnerTransId=${req.body.partnerTransId}
        // &responseTime=${req.body.responseTime}&status=${req.body.status}&storeId=${req.body.storeId}&transType=momo_wallet`;

        // const reqSig = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(rawReqSig).hex();

        // if (!reqSig === req.body.signature) {
        //     res.status(400).send("Authorize error!!!");
        //     return;
        // }

        console.log(req.body);


        const rawSignature = `amount=${req.body.amount}&message=${req.body.message}&momoTransId=${req.body.transaction_id}&partnerRefId=${req.body.order_id}&status=${req.body.status_code}`;

        const signature = sha256.hmac.create(adminSdk.momoConfig.secretKey).update(rawSignature).hex();

        const requestId = uuidv1();

        adminSdk.defauDatabase.ref('momoTrans/' + req.body.order_id).set({
            Id: req.body.order_id,
            MomoTransId: req.body.transaction_id,
            Amount: parseInt(req.body.amount),
            TransType: req.body.order_type,
            ResponseTime: req.body.response_time,
            StoreId: req.body.store_id,
            Status: status,
            OrderInfo: req.body.order_info,
            RequestId: requestId
        }, (error: any) => {

            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send({
                    status: status,
                    message: req.body.message,
                    amount: parseInt(req.body.amount),
                    partnerRefId: req.body.order_id,
                    momoTransId: req.body.transaction_id,
                    signature: signature
                });
            }
        })
    } else {
        res.status(400).send("trans failed");
    }

}

