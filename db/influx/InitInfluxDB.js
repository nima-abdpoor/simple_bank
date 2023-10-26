const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

const token = '17016_dKDI46cCu7c66ysgFXBX6ivvOV6qWQMLiMMv9XX9fJh_4gWbDIz9fx8F-OItfQaAhFMgYHlmnHn9PeeQ=='
const org = 'nima'
const bucket = 'bucket'

const client = new InfluxDB({url: 'http://127.0.0.1:8086', token: token})

async function writeData(id, request, response){
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({host: "BANK"})
    const requestPoint = new Point(id.toString())
        .stringField("request", request)
    const responsePoint = new Point(id.toString())
        .stringField("response", response)
    writeApi.writePoint(requestPoint)
    writeApi.writePoint(responsePoint)
    writeApi
        .close()
        .then(() => {})
        .catch(e => {
            console.error(e)
        })
}


module.exports = {
    writeData
}