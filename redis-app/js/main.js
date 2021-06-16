import BackendApp from "./application-tier/BackendApp.js";
import DiffusionClient from "./client-tier/DiffusionClient.js";
import DiffusionRedisCompareClient from "./client-tier/DiffusionRedisCompareClient.js";
import RedisClient from "./client-tier/RedisClient.js";
import DataFeed from "./data-feed/DataFeed.js";

export default class Main {
    constructor() {               
        this.initUiElements();

        // Instantiate Backend Application (Application Tier)
        this.backendApp = new BackendApp();        
        
        // Instantiate Data Feeder (Data Feed)
        this.dataFeeder = new DataFeed(this.apiResponseBodyEl);

        // Instantiate Client Tier
        this.comparisonClient = new DiffusionRedisCompareClient();
        this.redisClient = new RedisClient();
        this.diffusionClient = new DiffusionClient();
        
        // Add Buttons event listeners
        this.setEvents(); 
    }

    initUiElements = () => {
        // Redis / API Section elements
        this.apiResponseBodyEl = document.getElementById('responseValue'); // The Bitcoin API response
        this.startPollBtn = document.getElementById('startPolling'); // The button to start polling from the API        
    }

    /**
     * Create the event listeners
     */
    setEvents = () => {
        // Start polling from API into Redis
        this.startPollBtn.addEventListener('click', evt => {
            evt.preventDefault();
            
            this.diffusionClient.start();

            this.redisClient.start();

            this.backendApp.start();

            this.comparisonClient.start();

            /* Start getting data from Data Feed */
            this.dataFeeder.onStartPolling(evt);
        });
    }

}

window.onload = function () {
    let redisDiffusion = new Main();
};