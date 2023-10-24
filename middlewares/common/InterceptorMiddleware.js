const {createServiceCall} = require("../../db/interceptor/Interceptor");
const {mysqlPool} = require("../../db/DataBaseInit");
const {getUser} = require("../../db/user/Users");
const {getNidFromPath} = require("./CommonMiddleware");

async function interceptor(ctx, next) {
    let service = ctx.path
    let rawBody = ctx.request.rawBody
    const userResult = await getUser(mysqlPool, getNidFromPath(service))
    await next()
    let originalBody = ctx.body;
    let status = ctx.status
    if (typeof ctx.body === 'string' && ctx.response.is('json')) {
        ctx.body = JSON.parse(ctx.body);
    }
    let responseBody = ctx.body
    await createServiceCall(mysqlPool, {
        user: userResult.Id,
        service: service,
        request: rawBody,
        response: JSON.stringify(responseBody),
        response_status: status
    })
    ctx.body = originalBody;
}

module.exports = {
    interceptor
}