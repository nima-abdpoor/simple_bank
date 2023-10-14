const {createAccount, AccountTypes }  = require("../db/Account");

async function CreateAccount(router, db){
    let status = 502
    let message = ""
        router.post("/createAccount", async (context, next) => {
        try {
            name = context.request.body.name
            type = context.request.body.type
            if (name === undefined || type === undefined || !AccountTypes.includes(type)){
                 context.status = 400
                    return context.body = {message : "name or type should be valid!!"}
            }
            createAccount(db, {name: name, type: type, number: "123456"})
            return context.status = 200
        }catch (error){
            console.log("AccountController:" + error)
            return context.status = 502
        }
    })
}

module.exports = CreateAccount