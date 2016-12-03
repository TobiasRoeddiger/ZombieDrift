var express = require("express");
var app = require("express")();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//makes it possible to determine if the user is on mobile or desktop
var device = require('express-device');
app.use(device.capture());

//expose css resources publicly
app.use(express.static('public'));

app.get('/', function(req, res){
    if (req.device.type.toUpperCase() === "DESKTOP") {
        res.sendFile(__dirname + '/desktopController.html');
    } else if (req.device.type.toUpperCase() === "PHONE") {
        res.sendFile(__dirname + '/mobileController.html');
    }
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

io.on('connection', function (socket) {
  socket.on('getSocketIdForRoom', function (data) {
  	console.log("Request by ClientID " + data.clientId + " to get DesktopID of room " + data.roomId + ".");
  	console.log("Returning " + dict[data.roomId] + " to " + data.clientId);
  	io.to(data.clientId).emit('clientIdFromRoomId', { desktopClientId: dict[data.roomId]});
  });
  
  socket.on('inputData', function (data) {
  	console.log("New movement data for room with id " + data.roomId);
  });
  
  socket.on('addRoom', function (data) {
  	console.log("New room created [" + data.roomId + ", " + data.desktopClientId + "]");
    dict[data.roomId] = data.desktopClientId;
  });
  
  socket.on('newClient', function (data) {
  	console.log("New client for room " + data.desktopClientId + " with ClientID " + data.id);
    io.to(data.desktopClientId).emit('newClient', data);
  });
  
    					
  socket.on('newAccelerometerData', function(data) {
    io.to(data.desktopClientId).emit('newAccelerometerData', data);				
  });
  
  socket.on('movementData', function (data) {

    io.to(data.desktopClientId).emit(data);
  });
  
});

var dict = {123456: 'asdhiahd'};



