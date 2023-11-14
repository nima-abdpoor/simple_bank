async function RevokeToken(router, db) {
    router.post("/:nid/revokeToken", async (context, next) => {
        try {
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