const {Services} = require("../utils/Services")
require("jsonwebtoken");
require("../utils/PasswordDecryption");
const generateJWT = require("../service/JWTService");
const {createTokenTransaction} = require("../db/token/Token");
const {getUser} = require("../db/user/Users");

async function GetToken(router, db) {
    router.get("/:nid/token", async (context, next) => {
        try {
            let services = context.request.body.services
            let payload = ""
            for (const service of services) {
                let serviceIndex = Services.indexOf(service)
                if (serviceIndex === -1) {
                    context.status = 400
                    return context.body = {error: `Cant find service:${service}!`}
                }
                serviceIndex++
                payload += serviceIndex
            }
            const userResult = await getUser(db, context.params.nid)
            const access = generateJWT(payload, context.params.nid)
            createTokenTransaction(db, {
                user: userResult.Id,
                services: services,
                token: access
            }).catch(err => {
                console.log(err)
            });
            context.status = 200
            return context.body = {accessToken: access.access}
        } catch (err) {
            console.log(err)
            context.body = err.message
            return context.status = 500
        }
    })
}


module.exports = {
    GetToken
}