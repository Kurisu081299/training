"use strict";
const mysql = require("mysql2");
// const dotenv = require("dotenv").config();
//local mysql db connection
const dbConn = mysql.createConnection({
host: 'localhost',
user: 'root',
password: '135&robert081299',
database: 'test_db'
  });
dbConn.connect(function (err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;
