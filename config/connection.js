require('dotenv').config();
const dbconfig = require('./dbconfig');
const mysql = require('mysql2');

var connection;
if(process.env.JAWSDB_URL){
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection(dbconfig);
}

module.exports = connection;