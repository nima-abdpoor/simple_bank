const {getUser} = require("../../db/user/Users");
const {mysqlPool} = require("../../db/DataBaseInit")
const isPasswordMatches = require("../../utils/PasswordDecryption");
const tenDigitRegex = /^\d{10}$/;

async function checkNationalCodeValidation(ctx, next) {
    if (ctx.path.includes("/token")) {
        let nid = getNidFromPath(ctx.path)
        if (nid !== "") {
            if (!tenDigitRegex.test(nid)) {
                ctx.status = 400
                return ctx.body = {message: "nid is invalid!"}
            } else await next()
        } else {
            ctx.status = 400
            return ctx.body = {message: "nid should be provided!"}
        }

    } else await next()
}

function getNidFromPath(path){
    const firstSlashIndex = path.indexOf('/');
    const secondSlashIndex = path.indexOf('/', firstSlashIndex + 1);
    if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
        return path.substring(firstSlashIndex + 1, secondSlashIndex);
    }else return ""
}

async function checkUserExistence(ctx, next){
    if (ctx.path.includes("/token")) {
        let nid = getNidFromPath(ctx.path)
        let userResult = await getUser(mysqlPool, nid)
        if (userResult === undefined) {
            ctx.status = 400
            return ctx.body = {error: `Cant find user with nationalCode:${nid}!`}
        }else await next()
    } else await next()
}

module.exports = {
    getNidFromPath,
    checkNationalCodeValidation,
    checkUserExistence
}