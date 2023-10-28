const {AccountTypes} = require("../../db/account/db/Account");


async function checkUpdatePermissionInput(ctx, next) {
    if (ctx.path.includes("/permission")) {
        let number = ctx.request.body.number
        let nid = ctx.request.body.nid
        let permission = ctx.request.body.permissions
        if (!number ||
            !nid ||
            permission === undefined ||
            (typeof permission !== "object") ||
            (typeof number !== "string") ||
            (typeof nid !== "string")
        ) {
            ctx.status = 400
            return ctx.body = {message: "number, nid and permissions should be valid!!"}
        } else await next()
    } else await next()
}

module.exports = {
    checkUpdatePermissionInput
}