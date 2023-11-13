const {getUser} = require("../../db/user/Users");

async function checkUserPermissionInput(ctx, next) {
    if (ctx.path.includes("/permission") && ctx.method === "GET") {

        await next()
    } else await next()
}

module.exports = {
    checkUserPermissionInput
}