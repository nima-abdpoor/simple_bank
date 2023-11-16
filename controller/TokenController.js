const {Services} = require("../utils/Services")
require("jsonwebtoken");
require("../utils/PasswordDecryption");
const {createTokenTransaction, getRecordNumbers, getAccessTokenById, getTokenServices, updateTokenAccessToken} = require("../db/token/Token");
const {getUser} = require("../db/user/Users");
const jwt = require("jsonwebtoken");
const {generateJWTAccess, generateJWT} = require("../service/JWTService");

async function GetToken(router, db) {
    router.get("/:nid/token", async (context, next) => {
        try {
            let services = context.request.body.services
            let {payload, tokenId} = await createTokenPayload(db, services, undefined)
            const userResult = await getUser(db, context.params.nid)
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

async function RefreshToken(router, db) {
    router.get("/:nid/refreshToken", async (context, next) => {
        let token = {}
        try {
            token = await getAccessTokenById(context.user.tokenId)
            jwt.verify(token[0].token, process.env.JWT_KEY);
            context.status = 200
            return context.body = {message: "accessToken is still valid!", accessToken: token[0].token}
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                let services = await getTokenServices(context.user.tokenId)
                services = services.map(tService => tService.service)
                let {payload, tokenId} = await createTokenPayload(db, services, context.user.tokenId)
                const token = generateJWTAccess(payload, context.params.nid)
                let body = {
                    id: tokenId,
                    user: context.user.Id,
                    services: services,
                    token: token
                }
                let updateTokenResult = await updateTokenAccessToken(context.user.tokenId, body.user, body.token)
                if (updateTokenResult === 1){
                    context.status = 200
                    return context.body = {access: token}
                }else {
                    context.throw("Failed to generate access token", 500)
                }
            }
            console.log("RefreshToken: " + err)
            context.body = err.message
            return context.status = 500
        }
    })
}

async function createTokenPayload(db, services, tokenId){
    let payload = ""
    for (const service of services) {
        let serviceIndex = Services.indexOf(service)
        if (serviceIndex === -1) {
            return {error: `Cant find service:${service}!`}
        }
        serviceIndex++
        payload += serviceIndex
    }
    const recordNumbers = await getRecordNumbers(db)
    tokenId = tokenId ?? (recordNumbers[0].count) + 1
    payload += `_${tokenId}`
    return {payload: payload, tokenId: tokenId}
}


module.exports = {
    GetToken,
    RefreshToken
}