const accountPermissions = require("../../../utils/permission/Permissions")

const getAccountQuery = "select name, number, type, created_at from accounts join user_account\n" +
    "where accounts.id = user_account.account AND user_account.user = ?"
const getAccountWithTypeSuffix = " AND accounts.type = ?"
const getAccountWithNumberSuffix = " AND accounts.number = ?"
const createAccountQuery = "INSERT INTO accounts (name, number, type) VALUES (?,?,?)"
const createUserAccount = "INSERT INTO user_account (user, account) VALUES (?,?)"
const createUserPermissions = "INSERT INTO user_permission (user, account_id, permission) VALUES (?,?,?)"

function getAccounts(connection, getAccountBody){
    return new Promise((resolve, reject) => {
        let values = [getAccountBody.id]
        let query = getAccountQuery;
        if (getAccountBody.type !== undefined) {
            query += getAccountWithTypeSuffix
            values.push(getAccountBody.type)
        }
        if (getAccountBody.number !== undefined) {
            query += getAccountWithNumberSuffix
            values.push(getAccountBody.number)
        }
        connection.query(query, values , (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        })
    });
}

const createAccountTransaction = (pool, transactionBody) => {
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
                return connection.execute(createAccountQuery, [transactionBody.name, transactionBody.number, transactionBody.type], (err, result) =>{
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject("createAccountQuery failed", err)
                        });
                    }
                    return connection.execute(createUserAccount, [transactionBody.userId, result.insertId], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject("createUserAccount failed");
                            });
                        }
                        accountPermissions.forEach((value, index) => {
                            return connection.execute(createUserPermissions, [transactionBody.userId, result.insertId, value], (err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        console.log(err)
                                        return reject(`createUserPermissions index:${index} failed`);
                                    });
                                }
                            })
                        })
                        return connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return reject("createAccountTransaction Commit failed");
                                });
                            }
                            connection.release()
                        })
                    })
                })
            })
        })
    })
}

const AccountType = {
    SAVING: 'SAVING',
    MONEY_MARKET: 'MONEY_MARKET',
    FIXED_DEPOSIT: 'FIXED_DEPOSIT',
    CURRENT: 'CURRENT'
};

const AccountTypes = ["SAVING", "MONEY_MARKET", "FIXED_DEPOSIT", "CURRENT"]

module.exports = {
    AccountTypes,
    createAccountTransaction,
    getAccounts
}