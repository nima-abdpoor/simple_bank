const { createClient }  = require('redis');

async function addInRedis(key, value) {
    try {

        const client = createClient({
            url: 'redis://default:redispw@localhost:49153'
        });
        await client.connect();

        await client.set(key, value);

        await client.quit();
    } catch (e) {
        console.error(e);
    }
}

async function getFromRedis(key){
    try {
        const client = createClient();
        await client.connect();
        const myKeyValue = await client.get(key);
        console.log(myKeyValue)
    }catch (error){

    }
}


module.exports = {
    addInRedis,

}
