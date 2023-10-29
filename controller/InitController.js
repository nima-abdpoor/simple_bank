const User = require("./UserController");
const {GetToken} = require("./TokenController");
const {CreateAccount, GetAccount} = require("./AccountController");
const {UpdateUserPermission, GetUserPermissions} = require("./PermissionController");

async function startController(router, db) {
    //user
    await User(router, db)

    //account
    await CreateAccount(router, db)
    await GetAccount(router, db)

    //Permissions
    await UpdateUserPermission(router, db)
    await GetUserPermissions(router, db)

    //token
    await GetToken(router, db)
}

module.exports = startController