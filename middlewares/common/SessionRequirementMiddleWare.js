const {getUserAccess} = require("../../db/user/UserAccess");
const {mysqlPool} = require("../../db/DataBaseInit");

async function sessionRequirementChecker(ctx, next) {
    if (ctx.path.includes("/revokeToken") ||
        ctx.path.includes("/session")) {
        const access = await getUserAccess(mysqlPool, ctx.user.Id)
        if (access.access === "admin") {
            ctx.user.access = access
            await next()
        }else {
            ctx.status = 403
            return ctx.body = {message: "Only admin"}
        }
    } else await next();
}

module.exports = {
    sessionRequirementChecker
}