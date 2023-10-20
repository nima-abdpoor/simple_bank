const mysql = require('mysql2')
const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "sys",
    connectionLimit: 10,
});

module.exports = {
    mysqlPool
}