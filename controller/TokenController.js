const {Services} = require("../utils/Services")
require("jsonwebtoken");
require("../utils/PasswordDecryption");
const generateJWT = require("../service/JWTService");
const {createTokenTransaction, getRecordNumbers} = require("../db/token/Token");
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
            const recordNumbers = await getRecordNumbers(db)
            let tokenId = (recordNumbers[0].count) + 1
            payload += `_${tokenId}`
            const token = generateJWT(payload, context.params.nid)
            createTokenTransaction(db, {
                id: tokenId,
                user: userResult.Id,
                services: services,
                token: token
            }).catch(err => {
                console.log(err)
                return context.status = 500
            });
            context.status = 200
            return context.body = {access: token.access, refresh: token.refresh}
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