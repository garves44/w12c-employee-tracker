
const connectSettings = {
    host: process.env.HOST,
    port: process.env.MYSQLPORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
};

module.exports = connectSettings;
