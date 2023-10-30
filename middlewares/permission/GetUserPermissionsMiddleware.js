async function checkUserPermissionInput(ctx, next) {
    if (ctx.path.includes("/permission") && ctx.method === "GET") {
        let number = ctx.request.query.number
        if (number === undefined){
            ctx.status = 400
            return ctx.body = {message: "account number should be valid!!"}
        }
        await next()
    } else await next()
}

module.exports = {
    checkUserPermissionInput
}