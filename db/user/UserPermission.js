const {DataBaseTables} = require("../model/Tables");
const {knex} = require("../DataBaseInit");
const getUserPermissionsQuery = "select Id, permission from user_permission WHERE account_id = ? and user = ?"
const addUserPermissionQuery = "INSERT INTO user_permission (user, account_id, permission) VALUES (?,?,?)"
const removeUserPermissionQuery = "DELETE FROM user_permission WHERE id= ?"
const getUserPermissionWithTypeSuffix = " AND user_permission.permission = ?"

function getUserPermissions(connection, userPermissionBody) {
    return new Promise((resolve, reject) => {
        let body = [userPermissionBody.account, userPermissionBody.user]
        let query = getUserPermissionsQuery
        let type = userPermissionBody.type
        if (type !== undefined) {
            body.push(type)
            query += getUserPermissionWithTypeSuffix
        }
        connection.query(query, body, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve(result)
            }
        })
    })
}

async function getUserPermissionFromAccountId(accountId) {
    return knex.select()
        .from(DataBaseTables.UserPermissions)
        .where("account_id", accountId);
}

async function getUserPermissionFromUserId(userId) {
    return knex.select()
        .from(DataBaseTables.UserPermissions)
        .where("user", userId);
}

async function getAccountOwnerFromAccountId(accountId) {
    return knex.select()
        .from(DataBaseTables.USER_ACCOUNT)
        .where("account", accountId);
}

const addingUserPermissionsTransaction = (pool, transactionBody) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject("Error occurred while getting the connection");
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject("Error occurred while creating the transaction");
                }
                transactionBody.add.forEach((value, index) => {
                    return connection.execute(addUserPermissionQuery, [transactionBody.user, transactionBody.account, value], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`addingUserPermission failed: ${index}`, err)
                            });
                        }
                    })
                })
                return connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject("addingUserPermission Commit failed");
                        });
                    }
                    connection.release()
                })
            })
        })
    })
}

const removingUserPermissionsTransaction = (pool, transactionBody) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject("Error occurred while getting the connection");
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject("Error occurred while creating the transaction");
                }
                transactionBody.remove.forEach((value, index) => {
                    return connection.execute(removeUserPermissionQuery, [value], (err, result) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject(`removingUserPermissionsTransaction failed: ${index}`, err)
                            });
                        }
                    })
                })
                return connection.commit((err) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject("removingUserPermissionsTransaction Commit failed");
                        });
                    }
                    connection.release()
                })
            })
        })
    })
}

module.exports = {
    getUserPermissions,
    getUserPermissionFromAccountId,
    getAccountOwnerFromAccountId,
    addingUserPermissionsTransaction,
    removingUserPermissionsTransaction,
    getUserPermissionFromUserId
}