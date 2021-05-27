import Diffusion from "../clients/Diffusion.js";

export default class DiffusionService {
    constructor() {
        this.diffusionClient = null;
        this.chart = null;
    }

    setTargetChart = chart => this.chart = chart;

    diffusionClient = () => this.diffusionClient;

    /**
     * This is the event handler when the Connect to Diffusion button is clicked
     * @param {*} evt 
     */
    connect = (
        host, user, password, topic
    ) => {
        console.log('Connecting to Diffusion');        

        // Instantiate Diffusion's Client
        // We send the connect and on message callbacks to handle those events
        this.diffusionClient = new Diffusion(this.onConnectedToDiffusion, this.onDiffusionMessage);

        // Set Diffusion config
        this.diffusionClient.setConfig({
            host: host,
            user: user,
            password: password,
            topic: topic
        });

        // And connect to it
        this.diffusionClient.connect();
    }

    /**
     * This is the callback, Diffusion client calls after connection
     */
    onConnectedToDiffusion = () => {
        console.log('connected to diffusion');
        // Once we're connected, subscribe to the topic we specified when connecting to Diffusion service
        // We're not sending any parameters because we already set those when calling the setConfig function in the previous method.
        this.diffusionClient.subscribe({}); //Subscribe to Diffusion's topic
    }

    /**
     * This is the callback the Diffusion Client calls when a message is received
     * We update the Client Tier chart with this info
     * @param {*} message 
     */
    onDiffusionMessage = message => {
        console.log('on Diffusion message', message);

        this.chart.updateDataReceived(JSON.stringify(message).length);

        // This message came from Diffusion! Feed Diffusion's Chart
        this.chart.updateChart(message);
    }

    /**
     * Publish to diffusion
     * @param {*} data 
     */
    publish = data => {
        this.diffusionClient.publishData(data);
    }
}