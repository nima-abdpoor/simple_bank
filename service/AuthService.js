const generateJWT = require("./JWTService");
const {insertInRedis, getFromRedis} = require("./RedisService");
function Login({ payload, username }){
    return generateJWT(payload, username);
}

async function Refresh({payload, username, token }){
    await insertInRedis({
        key: token,
        value: "1",
        timeType: "EX",
        time: parseInt(process.env.JWT_REFRESH_TIME, 10),
    });
    return generateJWT(payload, username);
}

module.exports = {
    Login,
    Refresh
}