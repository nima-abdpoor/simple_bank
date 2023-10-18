const accountPermissions = require("../../permission/Permissions")

const createAccountQuery = "INSERT INTO accounts (name, number, type) VALUES (?,?,?)"
const createUserAccount = "INSERT INTO user_account (user, account) VALUES (?,?)"
const createUserPermissions = "INSERT INTO user_permission (user, account_id, permission) VALUES (?,?,?)"
function createAccount(connection, account) {
    return new Promise((resolve, reject) => {
        connection.query(createAccountQuery, account, (err, res) => {
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
                                    return reject("Commit failed");
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
    createAccount,
    AccountTypes,
    createAccountTransaction
}