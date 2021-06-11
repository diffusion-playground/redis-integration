import Chart from "./Chart.js"
import DiffusionService from "./lib/DiffusionService.js";

export default class DiffusionClient extends Chart {
    constructor() {
        super('diffusionChartDiv', 'diffusionDataReceived');
        this.diffusionService = new DiffusionService();
        this.topic = 'redis/bitcoin';
        this.initUiElements();
    }

    initUiElements = () => {
        // Diffusion Connection elements        
        this.hostEl = document.getElementById('host');
        this.userEl = document.getElementById('user');
        this.passwordEl = document.getElementById('password');
    }

    start = () => {
        this.subscribeToDiffusion();
    }

    /**
     * Subscribe to a diffusion Topic.
     * If it's not yet connected, first connect
     */
    subscribeToDiffusion = () => {
        if (!this.diffusionService.diffusionClient) {
            console.log('*** Diffusion Client: Connecting to Diffusion ***');
            this.diffusionService.connect(
                this.hostEl.value,
                this.userEl.value,
                this.passwordEl.value,
                this.topic,
                message => this.onDiffusionMessage(message)
            );
        }
    }

    /**
     * This is the callback the Diffusion Client calls when a message is received
     * We update the Client Tier chart with this info
     * @param {*} message 
     */
    onDiffusionMessage = message => {
        console.log('on Diffusion message', message);

        this.updateDataReceived(JSON.stringify(message).length);

        // This message came from Diffusion! Feed Diffusion's Chart
        this.updateChart(message);
    }
}