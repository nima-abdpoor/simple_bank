const User = require("./UserController");
const {GetToken, RefreshToken} = require("./TokenController");
const {CreateAccount, GetAccount} = require("./AccountController");
const {UpdateUserPermission, GetUserPermissions} = require("./PermissionController");
const {GetSession} = require("./SessionController");
const {RevokeToken} = require("./RevokeTokenController");

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
    await RefreshToken(router, db)
    await RevokeToken(router, db)

    //session
    await GetSession(router, db)
}

module.exports = startController