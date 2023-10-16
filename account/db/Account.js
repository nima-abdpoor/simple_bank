function createAccount(connection, account) {
    return new Promise((resolve, reject) => {
        const createAccountQuery = "INSERT INTO accounts SET ?"
        connection.query(createAccountQuery, account, (err, res) => {
            if (err) {
                reject(err.sqlMessage);
            } else {
                resolve(res);
            }
        })
    });
}

const AccountType = {
    SAVING: 'SAVING',
    MONEY_MARKET: 'MONEY_MARKET',
    FIXED_DEPOSIT: 'FIXED_DEPOSIT',
    CURRENT: 'CURRENT'
};

const AccountTypes = ["SAVING", "MONEY_MARKET", "FIXED_DEPOSIT", "CURRENT"]

module.exports = {
    createAccount,
    AccountTypes
}