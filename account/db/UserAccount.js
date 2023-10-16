function createUserAccount(connection, userAccount) {
    return new Promise((resolve, reject) => {
        const createUserAccount = "INSERT INTO user_account SET ?"
        connection.query(createUserAccount, userAccount, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        })
    });
}

module.exports = createUserAccount