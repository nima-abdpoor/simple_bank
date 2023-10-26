const {checkInput, checkPassword} = require("./token/GetTokenMiddleware")
const {checkCreateAccountInput} = require("./account/CreateAccountMiddleware")
const compose = require('koa-compose');
const {checkNationalCodeValidation, checkUserExistence, checkTokenValidation} = require("./common/CommonMiddleware");
const {interceptor} = require("./common/InterceptorMiddleware");

const Middlewares = compose(
    [
        //Interceptor
        interceptor,

        //GET_TOKEN:
        checkInput,
        checkUserExistence,
        checkPassword,

        //CreateAccount
        checkCreateAccountInput,

        //Common
        checkNationalCodeValidation,
        checkTokenValidation,
    ]
);

module.exports = Middlewares