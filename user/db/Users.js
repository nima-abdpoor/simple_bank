function createUser(connection, user) {
    return new Promise((resolve, reject) => {
        const createUserQuery = "INSERT INTO users SET ?";
        connection.query(createUserQuery, user, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = createUser