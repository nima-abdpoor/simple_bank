const {checkInput, checkPassword} = require("./token/GetTokenMiddleware")
const compose = require('koa-compose');
const {checkNationalCodeValidation, checkUserExistence} = require("./common/CommonMiddleware");

const Middlewares = compose(
    [
        //GET_TOKEN:
        checkInput,
        checkPassword,

        //Common
        checkNationalCodeValidation,
        checkUserExistence
    ]
);

module.exports = Middlewares