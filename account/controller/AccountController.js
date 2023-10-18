const {createAccount, AccountTypes, createAccountTransaction }  = require("../db/Account");
const {getUser} = require("../../user/db/Users");
const createUserAccount = require("../db/UserAccount");

async function CreateAccount(router, db){
    let status = 502
    let message = ""
        router.post("/:nid/createAccount", async (context, next) => {
        try {
            const userResult = await getUser(db, context.params.nid)
            if (userResult === undefined) {
                context.status = 400
                return context.body = {error: `Cant find user with nationalCode:${context.params.nid}!`}
            }
            name = context.request.body.name
            let type = context.request.body.type
            if (name === undefined || type === undefined || !AccountTypes.includes(type)){
                 context.status = 400
                    return context.body = {message : "name or type should be valid!!"}
            }
            let accountNumber = Math.floor((Math.random() * 10000) + 10000);
            accountNumber += (AccountTypes.findIndex(x => x === type) + 1).toString()
            createAccountTransaction(db, {name: name, type: type, number: accountNumber, userId: userResult.Id}).catch(err => {
                console.log(err)
            });
            return context.status = 200
        }catch (error){
            console.log(error)
            console.log("AccountController:" + error)
            return context.status = 502
        }
    })
}

module.exports = CreateAccount