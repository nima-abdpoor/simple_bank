function createAccount(connection, account) {
    const createAccountQuery = "INSERT INTO accounts SET ?"
    connection.query(createAccountQuery, account, (err, res) => {
        if (err) throw err;
    })
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