const User = require("../controller/UserController");
const {GetToken} = require("../controller/TokenController");
const CreateAccount = require("../controller/AccountController");

async function startController(router, db) {
    //user
    await User(router, db)

    //account
    await CreateAccount(router, db)

    //token
    await GetToken(router, db)
}

module.exports = startController