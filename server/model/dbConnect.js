const mysql = require('mysql2');

const database = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "exam_application"
});

module.exports = database;