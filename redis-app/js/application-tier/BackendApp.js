import DiffusionService from "./lib/DiffusionService.js";

export default class BackendApp {
    constructor() {
        // Lets create a Socket to interact with Redis
        this.redisWebSocket = new WebSocket("ws://127.0.0.1:3000/");        
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
        this.connectToDiffusion();
        this.startListeningRedisWebSocket();
    }

    connectToDiffusion = () => {
        /* We connect to diffusion */
        if (!this.diffusionService.diffusionClient) {
            console.log('--- BackendApp: Connecting to Diffusion ---');
            this.diffusionService.connect(
                this.hostEl.value,
                this.userEl.value,
                this.passwordEl.value,
                this.topic
            );
        }
    }

    /**
     * Add the websocket listener to listen for Redis Messages
     */
    startListeningRedisWebSocket = () => {
        console.log('--- BackendApp: Connecting to WebSocket ---');
        /* Then, we setup Redis Topic listener on the websocket */
        this.redisWebSocket.onmessage = ({ data }) => {            
            this.message = JSON.parse(data); // Parse the data from Redis
            console.log('Data received from Redis: ', this.message);
            
            // Publish received data to Diffusion
            this.publishToDiffusion(this.message);
        }
    }

    /**
     * Publish data received from socket to Diffusion
     * @param {*} data 
     */
    publishToDiffusion = data => {                
        if (this.diffusionService && this.diffusionService.diffusionClient) {
            this.diffusionService.publish(data);
        }
    }
}