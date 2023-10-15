const {createAccount, AccountTypes }  = require("../db/Account");

async function CreateAccount(router, db){
    let status = 502
    let message = ""
        router.post("/createAccount", async (context, next) => {
        try {
            name = context.request.body.name
            let type = context.request.body.type
            if (name === undefined || type === undefined || !AccountTypes.includes(type)){
                 context.status = 400
                    return context.body = {message : "name or type should be valid!!"}
            }
            let accountNumber = Math.floor((Math.random() * 10000) + 10000);
            accountNumber += (AccountTypes.findIndex(x => x === type) + 1).toString()
            createAccount(db, {name: name, type: type, number: accountNumber})
            return context.status = 200
        }catch (error){
            console.log("AccountController:" + error)
            return context.status = 502
        }
    })
}

module.exports = CreateAccount