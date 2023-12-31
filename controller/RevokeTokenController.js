const {updateTokenActivationState} = require("../db/token/Token");
async function RevokeToken(router) {
    router.post("/:nid/revokeToken", async (context) => {
        try {
            let revokeTokenResult = await updateTokenActivationState(context.user.tokenId)
            if (!revokeTokenResult || revokeTokenResult !== 1){
                context.throw("Error in revoking token", 500)
            }
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