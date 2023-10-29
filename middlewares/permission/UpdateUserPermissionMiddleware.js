const {AccountTypes} = require("../../db/account/db/Account");
const {Services} = require("../../utils/Services");
const accountPermissions = require("../../utils/permission/Permissions");


async function checkUpdatePermissionInput(ctx, next) {
    if (ctx.path.includes("/permission") && ctx.method === "POST") {
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
        }
        for (const value of permission) {
            let permissionIndex = accountPermissions.indexOf(value);
            if (permissionIndex === -1) {
                ctx.status = 400;
                ctx.body = { error: `Can't find permission: ${value}!` };
                return
            }
        }
        await next()
    } else await next()
}

module.exports = {
    checkUpdatePermissionInput
}