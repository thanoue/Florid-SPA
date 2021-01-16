module.exports = process.env.NODE_ENV !== 'development' ? {
    HOST: "localhost",
    USER: "khoikha",
    PASSWORD: "123456a@A",
    DB: "florid_1",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}: {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "root",
    DB: "test_db",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};