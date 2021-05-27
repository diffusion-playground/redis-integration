# Redis Tutorial:

## Bitcoin API: https://api.coindesk.com/v1/bpi/currentprice.json

## Example Response

{"time":{"updated":"May 4, 2021 12:45:00 UTC","updatedISO":"2021-05-04T12:45:00+00:00","updateduk":"May 4, 2021 at 13:45 BST"},"disclaimer":"This data was produced from the CoinDesk Bitcoin Price Index (USD). Non-USD currency data converted using hourly conversion rate from openexchangerates.org","chartName":"Bitcoin","bpi":{"USD":{"code":"USD","symbol":"&#36;","rate":"56,189.3483","description":"United States Dollar","rate_float":56189.3483},"GBP":{"code":"GBP","symbol":"&pound;","rate":"40,530.3322","description":"British Pound Sterling","rate_float":40530.3322},"EUR":{"code":"EUR","symbol":"&euro;","rate":"46,746.8407","description":"Euro","rate_float":46746.8407}}}

## Screens:

1. Main screen - Options:
	1. Get Bitcoin value using Redis
	2. Get bitcoin value using diffusion
2. Get Bitcoin value using Redis screen:
	1. Start polling from external endpoint: This will connect to the Bitcoin API above and publish to the local Redis PubSub server.
	2. A chart will be displayed below, that will show values as they arrive
	3. The api returns values for 3 different currencies. The chart will display only one of those, showing it receives more data than it needs.
3. Ge Bitcoin value using Diffusion screen:
	1. The screen will be the same as the one above, but the only difference will be that with diffusion we'll be able to select only the currency we want to show, making data received smaller.

