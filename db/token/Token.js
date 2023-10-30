const createTokenQuery = "INSERT INTO tokens (user, token) VALUES (?,?)"
const createUserTokenQuery = "INSERT INTO token_service (token, service) VALUES (?,?)"
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
                return connection.execute(createTokenQuery, [transactionBody.user, transactionBody.token.access], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject("createTokenQuery failed", err)
                        });
                    }
                    transactionBody.services.forEach((value, index) => {
                        return connection.execute(createUserTokenQuery, [result.insertId, value], (err) => {
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
    createTokenTransaction
}