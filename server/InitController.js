const User = require("./../user/controller/UserController");
const {GetToken} = require("./../token/controller/TokenController");
const CreateAccount = require("../account/controller/AccountController");

async function startController(router, db) {
    //user
    await User(router, db)

    //account
    await CreateAccount(router, db)

    //token
    await GetToken(router, db)
}

module.exports = startController