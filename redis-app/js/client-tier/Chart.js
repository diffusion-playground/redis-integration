export default class Chart {
    constructor(targetDiv, targetDataCounterDiv) {
        this.chart = JSC.chart(targetDiv, {
            yAxis_formatString: 'n',
            xAxis_overflow: 'hidden',
            margin_right: 20,
            toolbar: {
                margin: 5                
            },
            xAxis: { scale_type: 'time' },
            series: [
                {
                    name: 'USD',
                    points: []
                }
                /* Uncomment the following lines if you want to include more currencies */
                /*,
                {
                    name: 'GBP',
                    points: []
                },
                {
                    name: 'EUR',
                    points: []
                }*/
            ]
        });

        this.totalReceivedDataLength = 0;
        this.dataReceivedEl = document.querySelector(`#${targetDataCounterDiv}`);
    }

    getChart = () => {
        return this.chart;
    }

    /**
     * Updates chart with data from the external API
     * @param {*} data 
     */
    updateChart = (data) => {
        // Feed values into the chart
        this.chart.series(0).points.add({ y: parseFloat(data.bpi.USD.rate_float), x: data.time.updated });
        
        /* Uncomment the following lines if you want to show more currencies */

        /*this.chart.series(1).points.add({ y: parseFloat(data.bpi.GBP.rate_float), x: data.time.updated });
        this.chart.series(2).points.add({ y: parseFloat(data.bpi.EUR.rate_float), x: data.time.updated });*/
    }

    updateDataReceived = value => {
        this.totalReceivedDataLength += value;
        this.dataReceivedEl.innerHTML = this.totalReceivedDataLength;
    }
}