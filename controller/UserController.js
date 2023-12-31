const {createUser, createUserTr} = require("../db/user/Users");
const bcrypt = require("bcryptjs")
async function CreateUser(router, db){
    let status = 502
    let hashedPassword = ""
    router.post("/createUser", async (context, next) => {
        try {
            const access = context.request.body.access ?? 'user';
            if (context.request.body.username === undefined
                || context.request.body.password === undefined
                || context.request.body.nid === undefined){
                context.status = 400
                return context.body = {error : "username, nid and password should be provided!"}
            }
            let username = context.request.body.username
            let password = context.request.body.password
            let nid = context.request.body.nid
            if (!CheckPassword(password)) {
                context.status = 400
                return context.body = {error: "choose strong password!"}
            }

            await encryptPassword(password).then((result) => {
                if (result.error) {
                    console.error('Error:', result.error);
                } else {
                    hashedPassword = result.hashedPassword
                }
            });
            const createUserResult = await createUserTr(db, {username: username, password: hashedPassword, nid: nid, access: access})
            if (!createUserResult.success){
                console.log(createUserResult)
                return context.status = 500
            }
            context.body = { message: "User created successfully"}
            return context.status = 200
        }catch (err){
            context.serverError.push(err)
            if (err.error.code.includes("ER_DUP_ENTRY")){
                context.body = {error: "User Already Exits!"}
                return context.status = 401
            }
            console.log("UserController:" + err)
            context.body = {error: err}
            return context.status = 500
        }
    })
}

function CheckPassword(input) {
    const pass = /^(?=\D*\d)(?=(?:\W*\w){4})(?=.*[!@#$%^&*])[\w!@#$%^&*]+$/;
    return input.match(pass)
}

async function encryptPassword(rawPassword) {
    const result = { hashedPassword: "", error: null };

    try {
        const salt = await bcrypt.genSalt(10);
        result.hashedPassword = await bcrypt.hash(rawPassword, salt);
    } catch (error) {
        result.error = error;
    }

    return result;
}



module.exports = CreateUser