require("dotenv").config();

module.exports = {
    development: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },
    },
    production: {
        username: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            max: 20,
            min: 5,
            acquire: 30000,
            idle: 10000,
        },
    },
};
