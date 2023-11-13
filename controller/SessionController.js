const {getFromRedis} = require("../service/RedisService");
const {sessionGenerator} = require("../utils/session/Session");
const {gett} = require("../db/account/db/Account");

async function GetSession(router, db){
    router.get("/:nid/session", async (context, next) => {
        let nid = context.params.nid
        gett(db)
        const session = await getFromRedis(nid)
        console.log(session)
        if (session.success){
            context.status = 200
            return context.body = {sessionId: session.value}
        }
        else {
            context.status = 500
            return context.body = {error: ""}
        }
    })
}

module.exports = {
    GetSession
}