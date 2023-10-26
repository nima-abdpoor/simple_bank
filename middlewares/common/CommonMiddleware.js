const {getUser} = require("../../db/user/Users");
const {mysqlPool} = require("../../db/DataBaseInit")
const isPasswordMatches = require("../../utils/PasswordDecryption");
const jwt = require("jsonwebtoken");
const {Service} = require("../../utils/Services");
const tenDigitRegex = /^\d{10}$/;

async function checkNationalCodeValidation(ctx, next) {
    if (
        ctx.path.includes("/token") ||
        ctx.path.includes("/createAccount") ||
        ctx.path.includes("/createUser")) {
        let nid;
        if (ctx.path.includes("/createUser")) nid = ctx.request.body.nid
        else nid = getNidFromPath(ctx.path)
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

function getNidFromPath(path) {
    const firstSlashIndex = path.indexOf('/');
    const secondSlashIndex = path.indexOf('/', firstSlashIndex + 1);
    if (firstSlashIndex !== -1 && secondSlashIndex !== -1) {
        return path.substring(firstSlashIndex + 1, secondSlashIndex);
    } else return ""
}

async function checkUserExistence(ctx, next) {
    if (ctx.path.includes("/token")) {
        let nid = getNidFromPath(ctx.path)
        let userResult = await getUser(mysqlPool, nid)
        if (userResult === undefined) {
            ctx.status = 400
            return ctx.body = {error: `Cant find user with nationalCode:${nid}!`}
        } else await next()
    } else await next()
}

async function checkTokenValidation(ctx, next) {
    let serviceName
    let checkToken = true
    switch (true) {
        case ctx.path.includes("/createAccount"): {
            serviceName = Service.ADD_ACCOUNT
            break;
        }
        case ctx.path.includes("/accounts"): {
            serviceName = Service.GET_DEPOSITS
            break;
        }
        default: {
            checkToken = false
            break
        }
    }
    if (checkToken){
        try {
            const token = ctx.request.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if (
                decoded.type !== process.env.JWT_ACCESS ||
                decoded.aud !== process.env.JWT_AUDIENCE ||
                decoded.iss !== process.env.JWT_ISSUER ||
                decoded.name !== getNidFromPath(ctx.path)
            ) {
                ctx.status = 401
                return ctx.body = {error: "Invalid token type"}
            }
            if ((decoded.sub + '').indexOf(serviceName) <= -1) {
                ctx.status = 401
                return ctx.body = {error: "provided token is not compatible with current service!"}
            } else await next()
        } catch (err) {
            if (err.name === "JsonWebTokenError") {
                ctx.status = 401
                return ctx.body = {error: "Invalid token type"}
            }
            if (err.name === "TokenExpiredError") {
                ctx.status = 401
                return ctx.body = {error: "Token has been expired!"}
            } else {
                console.error(err)
                ctx.status = 500
                return ctx.body = {error: "Internal Server Error in validating Token!"}
            }
        }
    } else await next()
}

module.exports = {
    getNidFromPath,
    checkNationalCodeValidation,
    checkUserExistence,
    checkTokenValidation
}