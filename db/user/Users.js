const createUserQuery = "INSERT INTO users (username, password, nid) VALUES (?,?,?)";
const createUserAccessQuery = "INSERT INTO user_access (user, access) VALUES (?,?)";
const util = require('util');
const sleep = util.promisify(setTimeout);
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

async function createUserTr(pool, user) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject({message: "Error occurred while getting the connection", stack: new Error().stack, error: err});
            }
            return connection.beginTransaction(err => {
                if (err) {
                    connection.release();
                    return reject({message: "Error occurred while creating the transaction", stack: new Error().stack, error: err});
                }
                return connection.execute(createUserQuery, [user.username, user.password, user.nid], (err, result) => {
                    if (err) {
                        return connection.rollback(() => {
                            connection.release();
                            return reject({
                                message: "Error occurred while creating the User",
                                stack: new Error().stack,
                                error: err
                            }, err)
                        });
                    }
                    return connection.execute(createUserAccessQuery, [result.insertId, user.access], (err) => {
                        if (err) {
                            return connection.rollback(() => {
                                connection.release();
                                return reject({
                                    message: "Error occurred while creating UserAccess",
                                    stack: new Error().stack,
                                    error: err
                                }, err)
                            });
                        }
                        return connection.commit((err) => {
                            if (err) {
                                return connection.rollback(() => {
                                    connection.release();
                                    return reject({
                                        message: "createUserAccessTransaction Commit failed",
                                        stack: new Error().stack,
                                        error: err
                                    }, err)
                                });
                            }
                            resolve({success: true})
                            connection.release()
                        })
                    })
                })
            })
        })
    })
}

function getUser(connection, nid) {
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

function getUserById(connection, id) {
    return new Promise((resolve, reject) => {
        const getUserQuery = "SELECT * from users where id = ?";
        connection.query(getUserQuery, [id], (err, result) => {
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
    getUser,
    createUserTr,
    getUserById
}