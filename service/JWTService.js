const jwt = require("jsonwebtoken");

function generateJWT(payload, username) {
    const access = jwt.sign(
        {
            name: username,
            type: process.env.JWT_ACCESS,
        },
        process.env.JWT_KEY,
        {
            subject: payload,
            expiresIn: parseInt(process.env.JWT_ACCESS_TIME, 10),
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
        }
    );
    const refresh = jwt.sign(
        {
            name: username,
            type: process.env.JWT_REFRESH,
        },
        process.env.JWT_KEY,
        {
            subject: payload,
            expiresIn: parseInt(process.env.JWT_REFRESH_TIME, 10),
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
        }
    );
    return { access, refresh };
}

module.exports = generateJWT