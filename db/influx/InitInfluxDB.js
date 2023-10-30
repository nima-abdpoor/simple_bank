const {InfluxDB} = require('@influxdata/influxdb-client')
const {Point} = require('@influxdata/influxdb-client')

const token = 'cg1dY0y-cIcPvTW_StK9qGELGI2LNm3z3uhUtkqvMFVBZr15BzmnBMpozvjQY57vUyTgmGRe2jNx6hArYsohMg=='
const org = 'nima'
const bucket = 'bucket'

const client = new InfluxDB({url: 'http://127.0.0.1:8086', token: token})

async function writeDataInInflux(id, request, response, host){
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({host: host})
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
    writeDataInInflux
}