import Chart from "./Chart.js"
import DiffusionService from "./lib/DiffusionService.js";

export default class DiffusionRedisCompareClient extends Chart {
    constructor() {
        super('comparisonChartDiv', 'comparisonDelta',
            [
                {
                    name: 'DiffusionData',
                    points: []
                },
                {
                    name: 'RedisData',
                    points: []
                }
            ]
        );

        this.DIFFUSION_SERIES_IDX = 0;
        this.REDIS_SERIES_IDX = 1;
        

        // Instantiate Diffusion SDK Client Service
        this.diffusionService = new DiffusionService();
        
        // Lets create a Socket to interact with Redis
        this.redisWebSocket = new WebSocket("ws://127.0.0.1:3000/");

        this.topic = 'redis/bitcoin';

        this.diffusionDataLength = 0;
        this.redisDataLength = 0;

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
        this.startListeningRedisWebSocket();          
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

        this.diffusionDataLength += JSON.stringify(message).length;

        // This message came from Diffusion! Feed Diffusion's Chart
        this.updateCharts();
    }

    /**
     * Add the websocket listener to listen for Redis Messages
     */
    startListeningRedisWebSocket = () => {
        /* Then, we setup Redis Topic listener on the websocket */
        console.log('--- RedisClient: Connecting to WebSocket ---');
        this.redisWebSocket.onmessage = ({ data }) => {
            console.log(data);
            this.message = JSON.parse(data); // Parse the data from Redis
            console.log('Data received from Redis: ', this.message);

            this.redisDataLength += JSON.stringify(this.message).length;

            this.updateCharts();
        }
    }

    updateCharts = () => {
        this.updateChart(this.redisDataLength, this.REDIS_SERIES_IDX); //Feeds redis graph with data
        this.updateChart(this.diffusionDataLength, this.DIFFUSION_SERIES_IDX); //Feeds redis graph with data
        this.updateDataReceived();
    }

    /**
     * Override parent method to accomodate different data structure
     * @param {*} data 
     * @param {*} series 
     */
    updateChart = (data, series = 0) => {
        this.chart.series(series || 0).points.add({ y: parseFloat(data), x: new Date() });
    }

    updateDataReceived = value => {        
        this.dataReceivedEl.innerHTML = this.redisDataLength - this.diffusionDataLength;
    }
}