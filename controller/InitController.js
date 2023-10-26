const User = require("./UserController");
const {GetToken} = require("./TokenController");
const {CreateAccount, GetAccount} = require("./AccountController");

async function startController(router, db) {
    //user
    await User(router, db)

    //account
    await CreateAccount(router, db)
    await GetAccount(router, db)

    //token
    await GetToken(router, db)
}

module.exports = startController