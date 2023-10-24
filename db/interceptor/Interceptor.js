const createServiceCallQuery = "INSERT INTO service_call SET ?";
function createServiceCall(connection, serviceCallBody) {
    return new Promise((resolve, reject) => {
        connection.query(createServiceCallQuery, serviceCallBody, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        });
    });
}

module.exports = {
    createServiceCall
}