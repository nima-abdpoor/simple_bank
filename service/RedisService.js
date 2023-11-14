const {createClient} = require('redis');
const {sessionGenerator} = require("../utils/session/Session");
const redisURL = "redis://localhost:6379/"

async function addInRedis(key, value) {
    try {
        const client = createClient({
            url: redisURL
        });
        await client.connect()
        await client.setEx(key, process.env.REDIS_TTL, value, (error) => {
            if(error) {
                console.log(error)
                return {error: error}
            }
        })
    } catch (err) {
        console.log(err)
       return {
            message: `Error occurred while Adding ${key},${value} inside redis DB`,
            stack: new Error().stack,
            error: err
        }
    }
}

async function getFromRedis(key) {
    try {
        const client = createClient({
            url: redisURL
        });
        await client.connect()
        let value = await client.get(key)
        await client.quit()
        return {success: true, value: value}
    } catch (err) {
        return ({
            success: false,
            message: `Error occurred while Getting ${key}} From redis DB`,
            stack: new Error().stack,
            error: err
        })
    }
}


module.exports = {
    getFromRedis,
    addInRedis
}
