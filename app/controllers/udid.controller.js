const nodemailer = require("nodemailer");

exports.index = function (req, res) {

    var ua = require('useragent');
    if (ua.is(req.headers['user-agent']).mobile_safari) {
        if (req.cookies.newudid) {
            res.redirect('/enrollment');
        }
        else {
            res.render('index');
        }
    }
    else {
        res.render('index-notios');
    }

};

/*
* GET mobile config
*/

exports.enrollment = async function (req, res) {
    res.set('Content-Type', 'text/html');
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;

    var tudid = query.udid;
    if (tudid && extractValidUdid(tudid)) // If it's in the query, store it and redirect (so the user doesn't see the UDID being sent in the URL)
    {
        res.cookie('newudid', query.udid,
            {
                maxAge: 10 * 60 * 1000,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production' ? true : false
            });
        res.redirect('/enrollment');
    }
    else {
        var cookie = req.cookies.newudid;
        if (cookie && extractValidUdid(cookie)) {

            let testAccount = await nodemailer.createTestAccount();

            let transporter = nodemailer.createTransport({
                host: "smtp.ethereal.email",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });

            let info = await transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: "kha.tran.vinh.dev@gmail.com", // list of receivers
                subject: "Device UDID", // Subject line
                text: "", // plain text body
                html: '<b>Device UDID:</b><p>' + cookie + '</p>', // html body
            });

            // Found the cookie, let's render it
            res.render('udid', { udid: cookie, title: 'udid.fyi' });
        }
        else {
            // No cookie, redirect back to home page
            res.redirect('/');
        }
    }
}
exports.enroll = function (req, res) {

    var udid = extractValidUdid(req.body.toString())

    if (udid) {
        res.redirect(301, '/enrollment?udid=' + udid);
    }
    else {
        res.status(400)
        res.send('Did not find a valid UDID in the body')
    }
};

function extractValidUdid(udid) {
    const match = udid.match(/(0000[\d]{4}-00[A-Fa-f\d]+)|([a-fA-F\d]{40})/);

    if (match && match.length > 0) {
        return match[0]
    }
    else {
        return null
    }
}

