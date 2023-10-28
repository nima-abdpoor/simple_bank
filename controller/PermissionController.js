const {findAccountIdByNumber} = require("../db/account/db/Account");
const {getUser} = require("../db/user/Users");
const {getUserPermissions, addingUserPermissionsTransaction, removingUserPermissionsTransaction} = require("../db/user/UserPermission");

async function UpdateUserPermission(router, db) {
    router.post("/:nid/permission", async (context, next) => {
        try {
            let number = context.request.body.number
            let nid = context.request.body.nid
            let permissions = context.request.body.permissions
            const accountId = await findAccountIdByNumber(db, number)
            const user = await getUser(db, nid)
            if (accountId.length === 0) {
                context.status = 400
                return context.body = {error: `cant find accountNumber: ${number}`}
            }
            let userPermissions = await getUserPermissions(db, [accountId[0].Id, user.Id])
            let currentPermission = userPermissions.map(item => item.permission)
            let permissionsShouldBeAdd = permissions.filter(permission => !currentPermission.includes(permission));
            let permissionsShouldBeRemoved = currentPermission.filter(permission => !permissions.includes(permission));
            let IdsShouldBeRemoved = userPermissions.filter(user => permissionsShouldBeRemoved.includes(user.permission)).map(item => item.Id)
            addingUserPermissionsTransaction(db, {user: user.Id, account: accountId[0].Id, add: permissionsShouldBeAdd}).
            catch(err => {
                console.log("UpdateUserPermission: " + err)
            });
            removingUserPermissionsTransaction(db, {remove: IdsShouldBeRemoved}).
            catch(err => {
                console.log("UpdateUserPermission: " + err)
            });
            context.body = {message: "permissions successfully updated!"}
            return context.status = 200
        } catch (error) {
            console.log("ErrorInPermissionController: " + error)
            context.body = error
            return context.status = 500
        }
    })
}

module.exports = {
    UpdateUserPermission
}