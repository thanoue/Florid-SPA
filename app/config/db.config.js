module.exports = process.env.NODE_ENV !== 'development' ? {
    HOST: "localhost",
    USER: "florid",
    PASSWORD: "123456a@A",
    DB: "florid_main",
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