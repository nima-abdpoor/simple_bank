const {createUserServiceCall, createServiceCall} = require("../../db/interceptor/Interceptor");
const {mysqlPool} = require("../../db/DataBaseInit");
const {getUser} = require("../../db/user/Users");
const {getNidFromPath} = require("../common/CommonMiddleware");
const {writeDataInInflux} = require("../../db/influx/InitInfluxDB");

async function interceptor(ctx, next) {
    let userResult
    let service = ctx.path
    let nid = ctx.request.body.nid
    let rawBody = ctx.request.rawBody
    let address = ctx.request.ip
    await next()
    if (service.includes("/createUser")) {
        if (nid !== undefined) userResult = await getUser(mysqlPool, nid)
    } else userResult = await getUser(mysqlPool, getNidFromPath(service))
    let originalBody = ctx.body;
    let status = ctx.status
    if (typeof ctx.body === 'string' && ctx.response.is('json')) {
        ctx.body = JSON.parse(ctx.body);
    }
    let responseBody = ctx.body
    let result;
    let host;
    if (userResult !== undefined) {
        host = "UserServiceCall"
        result = await createUserServiceCall(mysqlPool, {
            user: userResult.Id,
            service: service,
            response_status: status
        })
    } else {
        host = "ServiceCall"
        result = await createServiceCall(mysqlPool, {
            address: address,
            service: service,
            response_status: status
        })
    }
    await writeDataInInflux(result.insertId, rawBody, JSON.stringify(responseBody), host)
    ctx.body = originalBody;
}

module.exports = {
    interceptor
}