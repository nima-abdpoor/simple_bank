const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

const token = 'jdmoUYVB507DwsPzm-e0GXjSP9exSu42GAABSfccJ84HzpIRFsY9mvJWVa-f2avEG0yCYUH5rlRObfiRoWAQ3w=='
const org = 'nima'
const bucket = 'bucket'

const client = new InfluxDB({url: 'http://127.0.0.1:8086', token: token})

async function writeDataInInflux(id, request, response, error, host){
    return new Promise((resolve, reject) => {
        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({host: host})
        const requestPoint = new Point(id.toString())
            .stringField("request", request)
        const responsePoint = new Point(id.toString())
            .stringField("response", response)
        const errorPoint = new Point(id.toString())
            .stringField("error", error.toString())
        writeApi.writePoint(requestPoint)
        writeApi.writePoint(responsePoint)
        writeApi.writePoint(errorPoint)
        writeApi
            .close()
            .then(() => {})
            .catch(e => {
                reject({message: "Error occurred while inserting in influxDB", stack: new Error().stack, error: e})
            })
        resolve({success: true})
    })
}


module.exports = {
    writeDataInInflux
}