const {DataBaseTables} = require("../model/Tables");
const {knex} = require("../DataBaseInit");
const createTokenQuery = "INSERT INTO tokens (id, user, token) VALUES (?,?,?)"
const createUserTokenQuery = "INSERT INTO token_service (token, service) VALUES (?,?)"
const recordNumbersQuery = "SELECT COUNT(*) as 'count' FROM tokens"
const getTokenActivationStateQuery = "select isActive from tokens where id = ?"

function getRecordNumbers(connection) {
    return new Promise((resolve, reject) => {
        connection.query(recordNumbersQuery, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        })
    })
}

function getTokenActivationState(connection, id) {
    return new Promise((resolve, reject) => {
        connection.query(getTokenActivationStateQuery, id, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        })
    })
}

async function updateTokenActivationState(id) {
    return knex.update({
        isActive: 0
    })
        .from(DataBaseTables.TOKEN)
        .where("id", id);
}

async function updateTokenAccessToken(id, userId, token) {
    return knex.update({
        user: userId,
        token: token,
        isActive: 1
    })
        .from(DataBaseTables.TOKEN)
        .where("id", id);
}

async function getAccessTokenById(id) {
    return knex.select()
        .from(DataBaseTables.TOKEN)
        .where("Id", id);
}

async function getTokenServices(id) {
    return knex.select()
        .from(DataBaseTables.TOKEN_SERVICE)
        .where("token", id);
}



const createTokenTransaction = (pool, transactionBody) => {
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
                return connection.execute(createTokenQuery, [transactionBody.id, transactionBody.user, transactionBody.token.access ?? transactionBody.token], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject("createTokenQuery failed", err)
                        });
                    }
                    transactionBody.services.forEach((value, index) => {
                        return connection.execute(createUserTokenQuery, [transactionBody.id, value], (err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    console.log(err)
                                    return reject(`createUserTokenQuery index:${index} failed`);
                                });
                            }
                            return connection.commit((err) => {
                                if (err) {
                                    return connection.rollback(() => {
                                        connection.release();
                                        return reject("createTokenTransaction Commit failed");
                                    });
                                }
                                connection.release()
                            })
                        })
                    })
                })
            })
        })
    })
}

module.exports = {
    createTokenTransaction,
    getRecordNumbers,
    getTokenActivationState,
    updateTokenActivationState,
    getAccessTokenById,
    getTokenServices,
    updateTokenAccessToken
}