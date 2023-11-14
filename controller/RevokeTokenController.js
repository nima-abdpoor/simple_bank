const {updateTokenActivationState} = require("../db/token/Token");
const {knex} = require("../db/DataBaseInit");

async function RevokeToken(router, db) {
    router.post("/:nid/revokeToken", async (context, next) => {
        try {
            const revokeTokenResult = await updateTokenActivationState(knex, context.user.tokenId)
            console.log(revokeTokenResult)
            context.status = 200
            return context.body = {message: "token successfully revoked!"}
        } catch (err) {
            context.serverError.push(err)
            console.log("RevokeToken:" + err)
            context.body = {error: err}
            return context.status = 500
        }
    })
}

module.exports = {
    RevokeToken
}