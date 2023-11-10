const {addInRedis} = require("../service/RedisService");

async function GetSession(router, db){
    router.get("/session", async (context, next) => {
        await addInRedis("salam", "nima")
    })
}

module.exports = {
    GetSession
}