'use strict';

const https = require("https");
const http = require("http");
const principleDesign = require("./principle-design.js");

const server = http.createServer(function(req,res){
	res.writeHead(200,{ 'Content-Type': 'application/json' });

	principleDesign.getQuote().then(function(quote){
		res.write(quote);
		res.end();
	});

});

server.listen(80);