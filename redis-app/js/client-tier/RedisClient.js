import Chart from "./Chart.js"

export default class RedisClient extends Chart {
    constructor() {
        super('chartDiv', 'redisDataReceived');
    }
}