const express = require("express");
var fs = require('fs');
const app = express();
const cors = require("cors");
app.use(cors());

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

app.get("/:lat/:long", function(req, res) {
    const lat = parseFloat(req.params.lat);
    const long = parseFloat(req.params.long);
    let risk = "";
    let nearby = [];
    for(let i = 0; i < quakes.length; i++){
        if(quakes[i].lat === null){
            continue;
        }
        const distance = Math.sqrt(Math.pow(lat - quakes[i].lat, 2) + Math.pow(long - quakes[i].long, 2));
        if((distance < 1 && quakes[i].mag > 6) || (distance < 2 && quakes[i].mag > 7) || (distance < 3 && quakes[i].mag > 8) || (distance < 4 && quakes[i].mag > 9)){
            risk = "critical";
            nearby.push({distance: distance * 69, mag: quakes[i].mag});
        }
        else if(((distance < 2 && quakes[i].mag > 6) || (distance < 3 && quakes[i].mag > 7) || (distance < 4 && quakes[i].mag > 8) || (distance < 5 && quakes[i].mag > 9)) && risk !== "critical"){
            risk = "very high";
            nearby.push({distance: distance * 69, mag: quakes[i].mag});
        }
        else if(((distance < 2 && quakes[i].mag > 6) || (distance < 3 && quakes[i].mag > 7) || (distance < 4 && quakes[i].mag > 8) || (distance < 5 && quakes[i].mag > 9)) && risk !== "critical" && risk !== "very high"){
            risk = "high";
            nearby.push({distance: distance * 69, mag: quakes[i].mag});
        }
        else if(((distance < 2 && quakes[i].mag > 6) || (distance < 3 && quakes[i].mag > 7) || (distance < 4 && quakes[i].mag > 8) || (distance < 5 && quakes[i].mag > 9)) && risk !== "critical" && risk !== "very high" && risk !== "high"){
            risk = "moderate";
            nearby.push({distance: distance * 69, mag: quakes[i].mag});
        }
        else if(risk !== "critical" && risk !== "very high" && risk !== "high" && risk !== "moderate"){
            risk = "low";
        }
    }
    const obj = JSON.stringify({risk: risk, nearby: nearby});
    console.log(obj);
    res.end(obj);
  });

app.listen(5000);