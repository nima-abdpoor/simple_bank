const Knex = require('knex')
const mysql = require('mysql2')
const mysqlPool = mysql.createPool({
    host: "localhost",
    user: "nima",
    password: "password",
    database: "sys",
    connectionLimit: 10,
});

const knex = Knex({
    client: 'mysql2',
    connection: {
        host : 'localhost',
        port : 3306,
        user : 'nima',
        password : 'password',
        database : 'sys'
    }
});

module.exports = {
    mysqlPool,
    knex
}