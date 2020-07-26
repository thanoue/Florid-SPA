module.exports = {
    HOST: "us-cdbr-east-02.cleardb.com",
    USER: "bdad218362ceb7",
    PASSWORD: "f11b7579",
    DB: "heroku_a2e85f765e5163c",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
// module.exports = {
//     HOST: "localhost",
//     USER: "root",
//     PASSWORD: "root",
//     DB: "test_mysql",
//     dialect: "mysql",
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// };