const express = require("express");
var fs = require('fs');
const app = express();

const data = fs.readFileSync('data/earthquakes.csv', 'utf8');
const lines = data.split("\n");
const quakes = lines.map((line) => {
    const split = line.split(",");
    let lat = null;
    let long = null;
    if(split[2] !== ""){
        lat = parseFloat(split[2]);
        long = parseFloat(split[3]);
    }
    const magSplit = split[5].split(" ");
    mag = parseFloat(magSplit[0]);
    return {lat: lat, long: long, mag: mag};
});

const lat = 0;
const long = 0;
console.log(quakes[0].lat);
console.log(quakes[0].long);
const distance = Math.sqrt(Math.pow(lat - quakes[0].lat, 2) + Math.pow(long - quakes[0].long, 2));
console.log(distance);


app.get("/:lat/:long", function(req, res) {
    const lat = req.params.lat;
    const long = req.params.long;
    let nearby = [];
    for(let i = 0; i < quakes.length; i++){
        if(quakes[i].lat === null){
            continue;
        }
        const distance = Math.sqrt(Math.pow(lat - quakes[i].lat, 2) + Math.pow(long - quakes[i].long, 2));
    }
    res.end(JSON.stringify(filteredList));
  });

app.listen(3000);