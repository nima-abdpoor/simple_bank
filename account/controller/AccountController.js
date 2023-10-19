const {createAccount, AccountTypes, createAccountTransaction }  = require("../db/Account");
const {getUser} = require("../../user/db/Users");
require("../db/UserAccount");
require("../../utils/PasswordDecryption");
const jwt = require("jsonwebtoken");

async function CreateAccount(router, db){
        router.post("/:nid/createAccount", async (context, next) => {
        try {
            name = context.request.body.name
            let type = context.request.body.type
            if (name === undefined || type === undefined || !AccountTypes.includes(type)){
                context.status = 400
                return context.body = {message : "name and type should be valid!!"}
            }
            if (context.request.headers.authorization === undefined) {
                context.status = 400
                return context.body = {error: "Authorization header is not present"}
            }
            const token = context.request.headers.authorization;
            const decoded = jwt.verify(token, process.env.JWT_KEY);
            if (
                decoded.type !== process.env.JWT_ACCESS ||
                decoded.aud !== process.env.JWT_AUDIENCE ||
                decoded.iss !== process.env.JWT_ISSUER ||
                decoded.name !== context.params.nid
            ) {
                context.status = 401
                return context.body = {error: "Invalid token type"}
            }
            console.log(decoded.sub)
            console.log(decoded.name)
            const userResult = await getUser(db, context.params.nid)
            let accountNumber = Math.floor((Math.random() * 10000) + 10000);
            accountNumber += (AccountTypes.findIndex(x => x === type) + 1).toString()
            createAccountTransaction(db, {name: name, type: type, number: accountNumber, userId: userResult.Id}).catch(err => {
                console.log(err)
            });
            return context.status = 200
        }catch (error){
            if (error.name === "JsonWebTokenError") {
                context.status = 401
                return context.body = {error: "Invalid token type"}
            }
            if (error.name === "TokenExpiredError") {
                context.status = 401
                return context.body = {error: "Token has been expired!"}
            }
            console.log("AccountController:" + error)
            return context.status = 502
        }
    })
}

module.exports = CreateAccount