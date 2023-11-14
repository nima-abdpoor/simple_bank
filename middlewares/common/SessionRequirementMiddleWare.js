const {getUserAccess} = require("../../db/user/UserAccess");
const {mysqlPool} = require("../../db/DataBaseInit");
const {getFromRedis} = require("../../service/RedisService");

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

async function sessionValidationChecker(ctx, next) {
    if (ctx.path.includes("/revokeToken")) {
        const sessionId = ctx.cookies.get('sessionId');
        if (!sessionId){
            ctx.status = 403
            return ctx.body = {message: "Invalid Session!"}
        }else {
            const session = await getFromRedis(ctx.user.nid)
            if (session.success && session.value && session.value === sessionId) {
                ctx.user.session = session.value
                await next()
            }else {
                ctx.status = 403
                return ctx.body = {message: "Invalid Session!"}
            }
        }
    } else await next();
}

module.exports = {
    sessionRequirementChecker,
    sessionValidationChecker
}