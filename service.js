'use strict';

const https = require("https");
const http = require("http");
const principleDesign = require("./principle-design.js");

const alexaResponse = {
	"version": "string",
	"response": {
	    "outputSpeech": {
	      "type": "PlainText",
	      "text": "Plain text string to speak"
    	}
    }
};

const server = http.createServer(function(req,res){
	res.writeHead(200,{ 'Content-Type': 'application/json' });

	principleDesign.getQuote().then(function(quote){
		alexaResponse.response.text = quote;
		res.write(JSON.stringify(alexaResponse));
		res.end();
	});

});

server.listen(80);