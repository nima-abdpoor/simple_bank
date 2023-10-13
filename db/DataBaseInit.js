const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "12345678",
    insecureAuth : true
});

function connectDatabase(){
    con.connect(function(err) {
        if (err) throw err;
        console.log("Database Connected!");
    });
}

module.exports = connectDatabase