const createUser = require("../db/Users");
const bcrypt = require("bcryptjs")
async function CreateUser(router, db){
    let status = 502
    router.post("/createUser", async (context, next) => {
        try {
            if (context.request.body.username === undefined || context.request.body.password === undefined){
                context.status = 400
                return context.body = {error : "username and password should be provided!"}
            }
            let username = context.request.body.username
            let password = context.request.body.password
            if (!CheckPassword(password)) {
                context.status = 400
                return context.body = {error: "choose strong password!"}
            }

            await encryptPassword(password).then((result) => {
                if (result.error) {
                    console.error('Error:', result.error);
                } else {
                    createUser(db, {username: username, password: result.hashedPassword})
                    status = 200
                }
            });

            return context.status = status

        }catch (error){
            console.log("UserController:" + error)
            context.body = error
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