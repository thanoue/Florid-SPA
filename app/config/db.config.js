const env = process.env.NODE_ENV || 'development';

module.exports = env !== 'development' ? {
    HOST: "localhost",
    USER: "vpsuser",
    PASSWORD: "123456789",
    DB: "florid_main",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
} : {
        HOST: "localhost",
        USER: "root",
        PASSWORD: "123456a@A",
        DB: "florid",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    };