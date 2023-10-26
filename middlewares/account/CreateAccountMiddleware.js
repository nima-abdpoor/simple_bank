const {AccountTypes} = require("../../db/account/db/Account");

async function checkCreateAccountInput(ctx, next) {
    if (ctx.path.includes("/createAccount")) {
        let name = ctx.request.body.name
        let type = ctx.request.body.type
        if (name === undefined || type === undefined || !AccountTypes.includes(type)) {
            ctx.status = 400
            return ctx.body = {message: "name and type should be valid!!"}
        }
        if (ctx.request.headers.authorization === undefined) {
            ctx.status = 400
            return ctx.body = {error: "Authorization header is not present"}
        }
        await next()
    } else await next()
}

async function checkGetAccountInput(ctx, next) {
    if (ctx.path.includes("/accounts")) {
        const type = ctx.request.query.type;
        if (type !== undefined) {
            if (!AccountTypes.includes(type)) {
                ctx.status = 400
                return ctx.body = {message: "type should be valid!!"}
            } else await next()
        } else await next()
    } else await next()
}

module.exports = {
    checkCreateAccountInput,
    checkGetAccountInput
}