const {AccountTypes, createAccountTransaction, getAccounts} = require("../db/account/db/Account");
const {getUser} = require("../db/user/Users");
require("../db/account/db/UserAccount");
require("../utils/PasswordDecryption");
require("jsonwebtoken");

async function CreateAccount(router, db) {
    router.post("/:nid/createAccount", async (context, next) => {
        try {
            let {name, type} = context.request.body
            const userResult = await getUser(db, context.params.nid)
            let accountNumber = Math.floor((Math.random() * 10000) + 10000);
            accountNumber += (AccountTypes.findIndex(x => x === type) + 1).toString()
            const accountTrResult = await createAccountTransaction(db, {
                name: name,
                type: type,
                number: accountNumber,
                userId: userResult.Id
            })
            context.body = {
                account: {
                    name: name,
                    type: type,
                    number: accountNumber
                }
            }
            return context.status = 200
        } catch (error) {
            console.log("AccountController:" + error)
            context.throw(500, error)
        }
    })
}

async function GetAccount(router, db) {
    router.get("/:nid/accounts", async (context, next) => {
        try {
            const type = context.request.query.type;
            const number = context.request.query.number;
            const userResult = await getUser(db, context.params.nid)
            let accounts = await getAccounts(db, {id: userResult.Id, type: type, number: number})
            context.status = 200
            return context.body = accounts
        } catch (error) {
            console.log("GetAccounts: " + error)
            context.status = 500
            return context.body = {error: error}
        }
    })
}

module.exports = {
    CreateAccount,
    GetAccount
}