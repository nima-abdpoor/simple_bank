const createUserServiceCallQuery = "INSERT INTO service_call_user SET ?";
const createServiceCallQuery = "INSERT INTO service_call SET ?";
function createUserServiceCall(connection, serviceCallBody) {
    return new Promise((resolve, reject) => {
        connection.query(createUserServiceCallQuery, serviceCallBody, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        });
    });
}

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
    createUserServiceCall,
    createServiceCall
}