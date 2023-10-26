require("../../utils/PasswordDecryption");
const {getUser} = require("../../db/user/Users");
const {mysqlPool} = require("../../db/DataBaseInit");
const isPasswordMatches = require("../../utils/PasswordDecryption");
const {getNidFromPath} = require("../common/CommonMiddleware");

async function checkInput(ctx, next) {
    if (ctx.path.includes("/token")) {
        let password = ctx.request.body.password
        let services = ctx.request.body.services
        if (password === undefined || services === undefined || services.size === 0){
            ctx.status = 400
            return ctx.body = {message : "services and password should be valid!!"}
        }else await next()
    } else await next();
}

async function checkPassword(ctx, next) {
    if (ctx.path.includes("/token")) {
        let password = ctx.request.body.password
        let nid = getNidFromPath(ctx.path)
        let userResult = await getUser(mysqlPool, nid)
        console.log(userResult)
        let result = await isPasswordMatches(password, userResult.password)
        if (!result){
            ctx.status = 403
            return ctx.body = {error: "Incorrect Password"}
        }else await next()
    }else await next()
}

module.exports = {
    checkInput,
    checkPassword
}