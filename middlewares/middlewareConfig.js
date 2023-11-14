const {checkInput, checkPassword} = require("./token/GetTokenMiddleware")
const {checkCreateAccountInput, checkGetAccountInput} = require("./account/CreateAccountMiddleware")
const compose = require('koa-compose');
const {checkNationalCodeValidation, checkUserExistence, checkTokenValidation} = require("./common/CommonMiddleware");
const {interceptor} = require("./interceptor/InterceptorMiddleware");
const {checkUpdatePermissionInput} = require("./permission/UpdateUserPermissionMiddleware");
const {checkUserPermissionInput} = require("./permission/GetUserPermissionsMiddleware");
const {sessionRequirementChecker, sessionValidationChecker} = require("./common/SessionRequirementMiddleWare");

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
        checkGetAccountInput,

        //Common
        checkNationalCodeValidation,
        checkTokenValidation,
        sessionRequirementChecker,
        sessionValidationChecker,

        //Permission
        checkUpdatePermissionInput,
        checkUserPermissionInput
    ]
);

module.exports = Middlewares