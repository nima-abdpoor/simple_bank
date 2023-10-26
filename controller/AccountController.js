const {AccountTypes, createAccountTransaction} = require("../db/account/db/Account");
const {getUser} = require("../db/user/Users");
require("../db/account/db/UserAccount");
require("../utils/PasswordDecryption");
require("jsonwebtoken");

async function CreateAccount(router, db) {
    router.post("/:nid/createAccount", async (context, next) => {
        try {
            let name = context.request.body.name
            let type = context.request.body.type
            const userResult = await getUser(db, context.params.nid)
            let accountNumber = Math.floor((Math.random() * 10000) + 10000);
            accountNumber += (AccountTypes.findIndex(x => x === type) + 1).toString()
            createAccountTransaction(db, {
                name: name,
                type: type,
                number: accountNumber,
                userId: userResult.Id
            }).catch(err => {
                console.log(err)
            });
            context.body = {message: "Account created successfully."}
            return context.status = 200
        } catch (error) {
            console.log("AccountController:" + error)
            return context.status = 502
        }
    })
}

module.exports = CreateAccount