const {Login, Refresh} = require("../../service/AuthService");
const jwt = require("jsonwebtoken");
const {getUser} = require("../../user/db/Users");
const {AccountTypes} = require("../../account/db/Account");
const isPasswordMatches = require("../../utils/PasswordDecryption");

async function GetToken(router, db) {
    router.get("/:nid/token", async (context, next) => {
        try {
            let password = context.request.body.password
            let services = context.request.body.services
            if (password === undefined || services === undefined || services.size === 0){
                context.status = 400
                return context.body = {message : "services and password should be valid!!"}
            }
            let userResult = await getUser(db, context.params.nid)
            if (userResult === undefined) {
                context.status = 400
                return context.body = {error: `Cant find user with nationalCode:${context.params.nid}!`}
            }
            let result = await isPasswordMatches(password, userResult.password)
            if (!result){
                context.status = 403
                return context.body = {error: "Incorrect Password"}
            }
            let payload = ""
            for (const service of services) {
                let serviceIndex = Services.indexOf(service)
                if (serviceIndex === -1) {
                    context.status = 400
                    return context.body = {error: `Cant find service:${service}!`}
                }
                serviceIndex++
                payload += serviceIndex
            }
            const { access } =
                Login({payload: payload,username: context.params.nid})
            context.status = 200
            return context.body = {accessToken: access}

            // const decoded = jwt.verify(access, process.env.JWT_KEY);
            // console.log("type:" + decoded.type)
            // console.log("sub:" + decoded.sub)
            // console.log("name:" + decoded.name)
        } catch (err) {
            console.log(err)
            context.body = err.message
            return context.status = 500
        }
    })
}

async function GetRefreshToken(router, db){
    router.get("/:nid/refresh", async (context, next) => {
        try{
            await Refresh({email: "NimaEmail", name: "Nima", token: context.request.body.token})
        }catch (err){
            console.log(err)
            context.body = err.message
            return context.status = 500
        }
    })
}

const Services = ["ADD_ACCOUNT", "GET_DEPOSITS", "UPDATE_PERMISSIONS", "GET_PERMISSIONS"]

const Service = {
    ADD_ACCOUNT: 1,
    GET_DEPOSITS: 2,
    UPDATE_PERMISSIONS: 3,
    GET_PERMISSIONS: 4
}

module.exports = {
    GetToken,
    GetRefreshToken
}