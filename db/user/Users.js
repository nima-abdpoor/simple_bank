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

function getUser(connection, nid) {
    console.log(nid)
    return new Promise((resolve, reject) => {
        const getUserQuery = "SELECT * from users where nid = ?";
        connection.query(getUserQuery, [nid], (err, result) => {
            if (err) {
                reject(err)
            }else {
                resolve(result[0])
            }
        })
    })
}

module.exports = {
    createUser,
    getUser
}