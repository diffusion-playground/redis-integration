import Chart from "./Chart.js"

export default class DiffusionClient extends Chart {
    constructor() {
        super('diffusionChartDiv', 'diffusionDataReceived');
    }
}