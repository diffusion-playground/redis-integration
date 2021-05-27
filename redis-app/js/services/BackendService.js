export default class BackendService {
    constructor() {
        // Lets create a Socket to interact with Redis
        this.redisWebSocket = new WebSocket("ws://127.0.0.1:3000/");
        this.chart = null;
        this.diffusionService = null;
    }

    setTargetChart = chart => this.chart = chart;

    setDiffusionService = diffusionService => this.diffusionService = diffusionService;

    /**
     * Add the websocket listener to listen for Redis Messages
     */
    startListeningRedisWebSocket = () => {
        this.redisWebSocket.onmessage = ({ data }) => {
            console.log(data);
            this.message = JSON.parse(data); // Parse the data from Redis
            console.log('Data received from Redis: ', this.message);
                        
            this.updateClient(data); //Feeds redis graph with data
            
            // Publish received data to Diffusion
            this.publishToDiffusion(this.message);
        }
    }
    
    /**
     * Updates Client with received data
     * @param {*} data 
     */
    updateClient = data => {
        this.chart.updateDataReceived(data.length);
        this.chart.updateChart(this.message); // Feed the Redis graph with it
    }

    /**
     * Sends data to the Redis Server
     * @param {*} data 
     */
    publish = data => {
        // Post to Redis Server through web sockets
        this.redisWebSocket.send(JSON.stringify(data));
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