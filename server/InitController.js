const User = require("./../user/controller/UserController");
const CreateAccount = require("../account/controller/AccountController");

async function startController(router, db) {
    //user
    await User(router, db)

    //account
    await CreateAccount(router, db)
}

module.exports = startController