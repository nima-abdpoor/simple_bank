const {findAccountIdByNumber} = require("../db/account/db/Account");
const {getUser, getUserById} = require("../db/user/Users");
const {
    getUserPermissions,
    addingUserPermissionsTransaction,
    removingUserPermissionsTransaction,
    getUserPermissionFromAccountId,
    getAccountOwnerFromAccountId
} = require("../db/user/UserPermission");
const {knex} = require("../db/DataBaseInit");



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
            let userPermissions = await getUserPermissions(db, {account: accountId[0].Id, user: user.Id})
            let currentPermission = userPermissions.map(item => item.permission)
            let permissionsShouldBeAdd = permissions.filter(permission => !currentPermission.includes(permission));
            let permissionsShouldBeRemoved = currentPermission.filter(permission => !permissions.includes(permission));
            let IdsShouldBeRemoved = userPermissions.filter(user => permissionsShouldBeRemoved.includes(user.permission)).map(item => item.Id)
            addingUserPermissionsTransaction(db, {
                user: user.Id,
                account: accountId[0].Id,
                add: permissionsShouldBeAdd
            }).catch(err => {
                console.log("UpdateUserPermission: " + err)
            });
            removingUserPermissionsTransaction(db, {remove: IdsShouldBeRemoved}).catch(err => {
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

async function GetUserPermissions(router, db) {
    router.get("/:nid/permissions", async (context, next) => {
        try {
            let userPermissions = []
            let isOwner
            const userIdMap = new Map();
            let number = context.request.query.number
            let nid = context.request.query.nid
            if (nid === undefined) nid = context.params.nid
            let permissionType = context.request.query.type
            let accountId;
            let user;
            if (number !== undefined) {
                accountId = await findAccountIdByNumber(db, number)
                if (accountId.length === 0) {
                    context.status = 400
                    return context.body = {error: `cant find accountNumber: ${number}`}
                }
            }
            if (nid !== undefined) {
                user = await getUser(db, nid)
                if (user.length === 0) {
                    context.status = 400
                    return context.body = {error: `cant find User: ${nid}`}
                }
            }
            const accountOwner = await getAccountOwnerFromAccountId(knex, accountId[0].Id)
            const permissions = await getUserPermissionFromAccountId(knex, accountId[0].Id)
            for (let pr of permissions){
                if (!userIdMap.has(pr.user))
                    userIdMap.set(pr.user, await getUserById(db, pr.user))
                let user = userIdMap.get(pr.user)
                isOwner = pr.user === accountOwner[0].user;
                userPermissions.push({permission: pr.permission, account: number, nid: user.nid, username: user.username, isOwner: isOwner})
            }
            context.body = userPermissions
        } catch (error) {
            console.log("ErrorInGetUserPermissionsController: " + error)
            context.body = error
            return context.status = 500
        }
    })
}

module.exports = {
    UpdateUserPermission,
    GetUserPermissions
}