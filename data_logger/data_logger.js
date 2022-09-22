const express = require('express');
const url = require('url');
const prom = require('prom-client');
const fs = require('fs');
const app = express();

app.use(express.json());
const httpPort = 3003;


const register = new prom.Registry();
register.setDefaultLabels({app: 'node_dataservice'});

const plain_tc_gauge_temp= new prom.Gauge(
	{
		help: "data_service plain_tc", 
		name: 'plain_tc', 
		labelNames: ['sensorName','scale'],
		registers: [register]
	}
);

const dht_gauge_temp = new prom.Gauge(
	{
		help: "data_service dht", 
		name: 'dht1_temp', 
		labelNames: ['sensorName','scale'], 
		registers: [register]
	}
);
const dht_gauge_hum  = new prom.Gauge(
	{
		help: "data_service dht", 
		name: 'dht1_hum',  
		labelNames: ['sensorName'], 
		registers: [register]
	}
);


app.get('/sensors/data/:schema', (req,res) => {
	const dataSchema = req.params.schema;

	console.log('Got Data for schema: ', dataSchema, ' in query: ', req.originalUrl);

	const timeStamp = Date.now();
	
	if ( typeof dataSchema !== 'undefined' && dataSchema ) {
		switch (dataSchema) {
			case "plain_tc": 
				console.log("Data in plain_tc schema");
				temperature = Number(req.query.t);
				sensorName = req.query.sn;
				plain_tc_gauge_temp.set(
					{
						sensorName: sensorName,
						scale: 'F'
					},
					temperature
				);
				console.log(sensorName, ": temp: ", temperature);
				break;

			case "dht":
				console.log("Data in dht schema");
				temperature = Number(req.query.t);
				humidity  = Number(req.query.h);
				sensorName = req.query.sn;
				dht_gauge_temp.set(
					{
						sensorName: sensorName,
						scale: 'F'
					},
					temperature
				);
				dht_gauge_hum.set(
					{
						sensorName: sensorName
					},
					humidity
				);
				console.log(sensorName, ": temp: ", temperature, " hum: ", humidity);
				break;	
			default:
				console.log("Default case");
				console.log('schema: ', dataSchema,' Body: ', req.query, 'Path', req.originalUrl);
		}
	}
	else {
		console.log("Error! Unknown schema");
	}

	res.sendStatus(200)

});

app.get('/metrics', async (req,res) => {
	res.set('Content-Type', register.contentType);
	let metrics = await register.metrics();
	res.send(metrics);
});

app.listen(httpPort, ()=>{console.log("App listening on :%d", httpPort)});
;
