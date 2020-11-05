// module.exports = {
//     HOST: "us-cdbr-east-02.cleardb.com",
//     USER: "bc5b03d7601dda",
//     PASSWORD: "de67d8b3",
//     DB: "heroku_4c375c28c6d7b66",
//     dialect: "mysql",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };

module.exports = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "test_mysql",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};