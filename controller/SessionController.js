const {getFromRedis} = require("../service/RedisService");
const {sessionGenerator} = require("../utils/session/Session");

async function GetSession(router, db){
    router.get("/:nid/session", async (context, next) => {
        let nid = context.params.nid
        const session = await getFromRedis(nid)
        if (session.success){
            context.status = 200
            return context.body = {sessionId: session.value}
        }
    })
}

module.exports = {
    GetSession
}