const logger = require('m-logger')
const log = logger({
    path: './mylogfiles', // define dir where log should be saved  
    filename: 'log_', // define filename exclude extension, default 'log'
})

exports.error = (err, res) => {

    let logString = `===================================================================\n${err}\n===================================================================`;

    log(logString, function (error) {
        console.error(err);
        if (res != undefined)
            res.status(500).send({ message: err.toString() });
    });

}