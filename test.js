'use strict';

const principleDesign = require("./principle-design.js");

principleDesign.getQuote().then(console.log)
.then( principleDesign.getQuote ).then(console.log)
.then( principleDesign.getQuote ).then(console.log);
