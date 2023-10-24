const {createUser} = require("../db/user/Users");
const bcrypt = require("bcryptjs")
async function CreateUser(router, db){
    let status = 502
    let hashedPassword = ""
    router.post("/createUser", async (context, next) => {
        try {
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
            const result = await createUser(db, {username: username, password: hashedPassword, nid: nid});
            return context.status = 200

        }catch (err){
            if (err.includes("Duplicate entry")){
                context.body = {error: err.message}
                return context.status = 401
            }
            console.log("UserController:" + err)
            context.body = {error: err}
            return context.status = 502
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