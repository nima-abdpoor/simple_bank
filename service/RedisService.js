const redis = require("redis");

const client = redis.createClient(
    {
        url: 'redis://default:redispw@localhost:49153'
    }
)
async function insertInRedis({ key, value, timeType, time }) {
    await client.connect();
    await client.set(key, value, timeType, time);
    await client.disconnect();
}

async function getFromRedis(key) {
    await this.client.connect();
    const result = await this.client.get(key);
    await this.client.disconnect();
    return result;
}

module.exports = {
    insertInRedis,
    getFromRedis
}