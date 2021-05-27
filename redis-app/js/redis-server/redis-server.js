const WebSocket = require('ws');
const redis = require('redis');

// Configuration: adapt to your environment
const REDIS_SERVER = "redis://localhost:6379";
const WEB_SOCKET_PORT = 3000;
const REDIS_CHANNEL = 'app:notifications';

// Connect to Redis and subscribe to "app:notifications" channel
var redisSubscriber = redis.createClient(REDIS_SERVER);
redisSubscriber.subscribe(REDIS_CHANNEL);

var redisPublisher = redis.createClient(REDIS_SERVER);

// Create & Start the WebSocket server
const server = new WebSocket.Server({ port: WEB_SOCKET_PORT });

// Register event for client connection
server.on('connection', function connection(ws) {
    // Message Received in Socket from webclient, and sent to redis
    ws.on('message', function (event) {
        console.log('Message from Websocket:', event);
        redisPublisher.publish(REDIS_CHANNEL, event);
    });

    // Message received from Redis, and sent through Websocket to Webclients
    redisSubscriber.on('message', function (channel, message) {
        console.log('Redis Subscriber: ', channel, message);
        ws.send(message);
    })

});


console.log("WebSocket server started at ws://locahost:" + WEB_SOCKET_PORT);