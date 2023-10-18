const mysql = require('mysql2');
const con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "12345678",
    database: "sys",
    connectionLimit: 10,
});

function connectDatabase(){
   return con
}

module.exports = connectDatabase