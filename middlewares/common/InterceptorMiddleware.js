const {createServiceCall} = require("../../db/interceptor/Interceptor");
const {mysqlPool} = require("../../db/DataBaseInit");
const {getUser} = require("../../db/user/Users");
const {getNidFromPath} = require("./CommonMiddleware");

async function interceptor(ctx, next) {
    let service = ctx.path
    let rawBody = ctx.request.rawBody
    let userId = ctx.request.ip
    const userResult = await getUser(mysqlPool, getNidFromPath(service))
    userId = userResult === undefined ? userId : userResult.Id
    console.log(typeof userId)
    await next()
    let originalBody = ctx.body;
    let status = ctx.status
    if (typeof ctx.body === 'string' && ctx.response.is('json')) {
        ctx.body = JSON.parse(ctx.body);
    }
    let responseBody = ctx.body
    await createServiceCall(mysqlPool, {
        user: userId.toString(),
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