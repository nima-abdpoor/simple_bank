const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")
const startController = require("./server/InitController");
const dotenv = require("dotenv");


main()
function main(){
    dotenv.config()
    let dbConnection = initDB()
    server.startServer()
    startController(server.router, dbConnection).then()
}