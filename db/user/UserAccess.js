const getUserQuery = "SELECT * from user_access where user = ?";
function getUserAccess(connection, userId) {
    return new Promise((resolve, reject) => {
        connection.query(getUserQuery, [userId], (err, result) => {
            if (err) {
                reject(err)
            }else {
                resolve(result[0])
            }
        })
    })
}

module.exports = {
    getUserAccess
}