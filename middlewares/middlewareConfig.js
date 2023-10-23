const {checkInput, checkPassword} = require("./token/GetTokenMiddleware")
const {checkCreateAccountInput} = require("./account/CreateAccountMiddleware")
const compose = require('koa-compose');
const {checkNationalCodeValidation, checkUserExistence, checkTokenValidation} = require("./common/CommonMiddleware");

const Middlewares = compose(
    [
        //GET_TOKEN:
        checkInput,
        checkPassword,

        //CreateAccount
        checkCreateAccountInput,

        //Common
        checkNationalCodeValidation,
        checkUserExistence,
        checkTokenValidation,
    ]
);

module.exports = Middlewares