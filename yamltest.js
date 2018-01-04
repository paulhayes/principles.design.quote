'use strict';

const yaml = require("js-yaml");
const https = require("https");
const process = require("process");
const URL = require("url");
let indexUrl = "https://api.github.com/repositories/94198471/contents/_examples";

let getHttp = function(url, callback){
	let headers = {'User-Agent': 'nodejs'};
	let urlObj = URL.parse(url);
	urlObj.headers = headers;
	https.get(urlObj,function(res){
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
		return arr[Math.floor(Math.random()*arr.length)];
	}
	else {
		throw new Error("Invalid argument error. pickRandom expects Array, got "+typeof(arr));
	}
}



getHttp(indexUrl, function(indexTxt){

	let index = JSON.parse(indexTxt);
	let picked = pickRandom(index);
	//console.log("picked ",picked," from ",index);
	getHttp(picked.download_url,function(responseTxt){
		let data;
		try {
			let output = "";
			responseTxt = responseTxt.replace(new RegExp("---",'g'),"");
			data = yaml.load(responseTxt);
			//console.log( data );
			let principle = pickRandom(data.principles);
			if( 'title' in data )
				output+=`From ${data.title}\n`;
			if( 'author' in data )
				output += `by ${data.author}\n`;
			if( 'summary' in principle )
				output += (`${principle.principle}\n${principle.summary}\n`);
			else 
				output += (`${principle.principle}\n`);
			console.log(output);
		}
		catch(e){
			throw new Error("Error passing md file. Invalid YAML");
		}	
	});
});


