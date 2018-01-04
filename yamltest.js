'use strict';

const yaml = require("js-yaml");
const https = require("https");
const process = require("process");
const config = require("config.js");

let indexUrl = "https://api.github.com/repositories/94198471/contents/_examples?"+`client_id=${config.client_id}&client_secret=${config.client_secret}`;

let getHttp = function(url, callback){
	https.get(url,function(res){
		const { statusCode } = res;
		if( statusCode != 200 ){
			console.error( "HTTPS Get Failed ",url, statusCode )
			process.exit();
		}
		let responseTxt = "";
		res.on('data',function(c){
			responseTxt += c;
		});
		res.on('end',function(){
			callback(responseTxt);

		});
	});
}

let pickRandom = function(arr){
	if(arr instanceof Array){
		return arr[Math.floor(Math.random*arr.length)];
	}
	else {
		throw new Error("Invalid argument error. pickRandom expects Array, got "+typeof(arr));
	}
}



getHttp(indexUrl, function(indexTxt){

	let index = JSON.parse(indexTxt);
	let picked = pickRandom(index);
	console.log("picked ",picked);
	getHttp(picked.download_url,function(responseTxt){
		let data;
		try {
			responseTxt = responseTxt.replace(new RegExp("---",'g'),"");
			console.log(responseTxt);
			data = yaml.load(responseTxt);
			console.log( data );
			let principle = pickRandom(data.principles);
			console.log(`${principle.principle}\n${principle.summary}`);
		}
		catch(e){
			throw new Error("Error passing md file. Invalid YAML");
		}	
	});
});


