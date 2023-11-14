const {getFromRedis, addInRedis} = require("../service/RedisService");
const {sessionGenerator} = require("../utils/session/Session");

async function GetSession(router){
    router.get("/:nid/session", async (context, next) => {
        try {
            let nid = context.params.nid
            let session = await getFromRedis(nid)
            if (session.value === null) {
                await addInRedis(nid, sessionGenerator())
                session = await getFromRedis(nid)
            }
            if (session.success){
                context.status = 200
                return context.body = {sessionId: session.value}
            }
            else {
                context.throw(500, "Server Error In Generating Session!")
            }
        }catch (error){
            console.log("GetSession:" + error)
            context.status = 500
            return context.body = {error: ""}
        }
    })
}

module.exports = {
    GetSession
}