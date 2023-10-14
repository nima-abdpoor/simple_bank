function createUser(connection, user) {
    const createUserQuery = "INSERT INTO users SET ?"
    connection.query(createUserQuery, user, (err, res) => {
        if (err) throw err;
    })
}

module.exports = createUser