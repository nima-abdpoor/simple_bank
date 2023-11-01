const {mysqlPool} = require("./db/DataBaseInit")
const server = require("./server/Server")
const startController = require("./controller/InitController");
const dotenv = require("dotenv");


function main(){
    dotenv.config()
    server.startServer()
    startController(server.router, mysqlPool).then()
}

main()