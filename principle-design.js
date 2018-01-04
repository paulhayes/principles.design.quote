const URL = require("url");
const https = require("https");
const process = require("process");
const yaml = require("js-yaml");

function constructor(){
	const indexUrl = "https://api.github.com/repositories/94198471/contents/_examples";
	const timeout = 3600*24*1000;
	let index;
	let lastIndexFetch = 0;

	const getHttp = function(url){
		return new Promise(function(resolve,reject){
			let headers = {'User-Agent': 'nodejs'};
			let urlObj = URL.parse(url);
			urlObj.headers = headers;
			https.get(urlObj,function(res){
				const { statusCode } = res;
				if( statusCode != 200 ){
					throw new Error( "HTTPS Get Failed ",url, statusCode )
				}
				let responseTxt = "";
				res.on('data',function(c){
					responseTxt += c;
				});
				res.on('end',function(){
					resolve(responseTxt);
				});
			});
		});
		
	}

	const pickRandom = function(arr){
		if(arr instanceof Array){
			return arr[Math.floor(Math.random()*arr.length)];
		}
		else {
			throw new Error("Invalid argument error. pickRandom expects Array, got "+typeof(arr));
		}
	}


	const getQuote = function(){
		var promise = new Promise(async function(resolve,reject){
			let elapsed = Date.now() - lastIndexFetch;
			if( typeof index === "undefined" || elapsed > timeout ){
				let indexTxt = await getHttp(indexUrl);
			 	index = JSON.parse(indexTxt);
			 	lastIndexFetch = Date.now();
			}
			let picked = pickRandom(index);
			//console.log("picked ",picked," from ",index);
			responseTxt = await getHttp(picked.download_url);
			let data;
			try {
				let output = "";
				responseTxt = responseTxt.replace(new RegExp("---",'g'),"");
				data = yaml.load(responseTxt);
				let principle = pickRandom(data.principles);
				if( 'title' in data )
					output+=`From ${data.title}\n`;
				if( 'author' in data )
					output += `by ${data.author}\n`;
				if( 'summary' in principle )
					output += (`${principle.principle}\n${principle.summary}\n`);
				else 
					output += (`${principle.principle}\n`);
				resolve(output);
			}
			catch(e){
				throw new Error("Error passing md file. Invalid YAML");
			}	
		});
		return promise;
	}
	
	let obj = { getQuote };
	return Object.freeze( obj );

}

module.exports = constructor();