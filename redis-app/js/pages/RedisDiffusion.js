import DataFeeder from "../services/DataFeeder.js";
import BackendService from "../services/BackendService.js";
import DiffusionClient from "../components/DiffusionClient.js";
import RedisClient from "../components/RedisClient.js";
import DiffusionService from "../services/DiffusionService.js";

export default class RedisDiffusion {
    constructor() {               
        this.initUiElements();

        // This is the topic name we are using everywhere
        this.topic = 'redis/bitcoin';

        // Instantiate Redis Service (Data Tier)
        this.backendService = new BackendService();
        this.backendService.setTargetChart(new RedisClient());
        
        // Instantiate Data Feeder (Market Data)
        this.dataFeeder = new DataFeeder(this.apiResponseBodyEl);
        this.dataFeeder.setBackendService(this.backendService);

        // Instantiate Diffusion Service (Aplication Tier)
        this.diffusionService = new DiffusionService();
        this.diffusionService.setTargetChart(new DiffusionClient());

        // We set diffusion service into redis service for publishing data.
        this.backendService.setDiffusionService(this.diffusionService);
                
        // Client tier is represented by the Diffusion and Redis Clients

        // Add Buttons event listeners
        this.setEvents(); 
    }

    initUiElements = () => {
        // Redis / API Section elements
        this.apiResponseBodyEl = document.getElementById('responseValue'); // The Bitcoin API response
        this.startPollBtn = document.getElementById('startPolling'); // The button to start polling from the API

        // Diffusion Section elements
        this.connectBtn = document.getElementById('connectToDiffusion');
        this.hostEl = document.getElementById('host');
        this.userEl = document.getElementById('user');
        this.passwordEl = document.getElementById('password');        
    }

    /**
     * Create the event listeners
     */
    setEvents = () => {
        // Start polling from API into Redis
        this.startPollBtn.addEventListener('click', evt => {
            evt.preventDefault();
            this.dataFeeder.onStartPolling(evt)
            this.backendService.startListeningRedisWebSocket();
        });

        // Connect to Diffusion Service
        this.connectBtn.addEventListener('click', evt => this.onDiffusionConnectBtnClicked(evt));
    }
    
    onDiffusionConnectBtnClicked = evt => {
        evt.preventDefault();
        this.diffusionService.connect(
            this.hostEl.value,
            this.userEl.value,
            this.passwordEl.value,
            this.topic
        );
    }

}

window.onload = function () {
    let redisDiffusion = new RedisDiffusion();
};