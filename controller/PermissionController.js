const {findAccountIdByNumber, getAccountInfoById} = require("../db/account/db/Account");
const {getUser, getUserById} = require("../db/user/Users");
const lodash = require('lodash');

const {
    getUserPermissions,
    addingUserPermissionsTransaction,
    removingUserPermissionsTransaction,
    getUserPermissionFromUserId, getUserPermissionByAccountIdNotOwner
} = require("../db/user/UserPermission");
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
            let result = []
            let {nid, type, number} = context.request.query
            let permissions = await getUserPermissionFromUserId(context.user.Id)
            let notOwnerPermissions = await getUserPermissionByAccountIdNotOwner(context.user.Id)
            const accountIds = lodash.uniq(lodash.map(permissions, 'account_id'));
            let accountInfo = []
            for (let id of accountIds){
                accountInfo.push(await getAccountInfoById(id))
            }
            notOwnerPermissions = lodash.filter(notOwnerPermissions, item => {
                return lodash.includes(accountIds, item.account_id);
            });
            const allPermissions = lodash.union(permissions, notOwnerPermissions);
            const resuasdflt = lodash(allPermissions)
                .groupBy(item => `${item.account_id}_${item.user}`)
                .map((group, accountId) => {
                    const firstItem = group[0];
                    return {
                        ...lodash.omit(firstItem, 'permission'),
                        permission: lodash.uniq(lodash.map(group, 'permission')),
                    };
                })
                .value();
            let resultWithAccountInfo = lodash.flatMap(resuasdflt, permission => {
                const account = lodash.find(accountInfo, a => {
                    return lodash.find(a, { Id: permission.account_id });
                });
                return {
                    ...permission,
                    ...{name: account[0].name, number: account[0].number, type: account[0].type}
                };

            });
            let users = lodash.uniq(lodash.map(resultWithAccountInfo, 'user'))
            let userInfo = []
            for (let id of users){
                userInfo.push(await getUserById(db, id))
            }
            result = lodash.map(resultWithAccountInfo, res => {
                const user = lodash.find(userInfo, { Id: res.user });
                return {
                    ...res,
                    ...{nid: user.nid, username: user.username}
                };
            });
            if (number !== undefined) {
                result = lodash.filter(result, item => {
                    return item.number === number;
                });
            }
            if (nid !== undefined) {
                result = lodash.filter(result, item => {
                    return item.nid === nid;
                });
            }
            if (type !== undefined) {
                result = lodash.filter(result, item => {
                    return item.type === type;
                });
            }
            context.body = result
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