const initDB = require("./db/DataBaseInit")
const server = require("./server/Server")
const startController = require("./server/InitController");


main()
function main(){
    let dbConnection = initDB()
    server.startServer()
    startController(server.router, dbConnection).then()
}