var express = require("express");
var app = require("express")();
var http = require('http').Server(app);

//makes it possible to determine if the user is on mobile or desktop
var device = require('express-device');
app.use(device.capture());

//expose css resources publicly
app.use(express.static('public'));

app.get('/', function(req, res){
    if (req.device.type.toUpperCase() === "DESKTOP") {
        res.sendFile(__dirname + '/mobileController.html');
    } else if (req.device.type.toUpperCase() === "PHONE") {
        res.sendFile(__dirname + '/mobileController.html');
    }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});