import Chart from "./Chart.js"

export default class RedisClient extends Chart {
    constructor() {        
        super('chartDiv', 'redisDataReceived');

        // Lets create a Socket to interact with Redis
        this.redisWebSocket = new WebSocket("ws://127.0.0.1:3000/");
        this.topic = 'redis/bitcoin';
    }

    start = () => {
        this.startListeningRedisWebSocket();
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

            this.updateClient(data); //Feeds redis graph with data
        }
    }

    /**
     * Updates Client with received data
     * @param {*} data 
     */
    updateClient = data => {
        this.updateDataReceived(data.length);
        this.updateChart(this.message); // Feed the Redis graph with it
    }
}