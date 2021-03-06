var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var io_file_client = require('socket.io-client');
var io_file_server = require('socket.io').listen(4000);
var io_client = require('socket.io-client');
var dl  = require('delivery');
import {config} from './config';
import {EventHandler} from './eventHandler';
import {DEV} from './header';
import debug from './debug';
var fs = require('fs');
var ss = require('socket.io-stream');
var os = require('os');

var serv_sock = []; // Used in broadcast function
var connections = [];

export function setMyAddr(){
  var interfaces = os.networkInterfaces();
  var addresses = [];
  for (var k in interfaces) {
      for (var k2 in interfaces[k]) {
          var address = interfaces[k][k2];
          if (address.family === 'IPv4' && !address.internal) {
              addresses.push(address.address);
          }
      }
  }
  config.my_addr = addresses[0];
}

export function initServer(){

  setMyAddr();

  for(var i = 0; i < config.server_addr.length; i++){
    if(config.server_addr[i] == config.my_addr) continue;
    var s_addr = 'http://' + config.server_addr[i] + ':3000/';
    serv_sock.push(io_client(s_addr));
  }



  http.listen(3000, function(){
    debug.log('Server started on port 3000', DEV);
  });


  io.on('connection', function(socket){
    debug.log('A user connected', DEV);

    var endpoint = socket.request.connection._peername;
    var ip = endpoint.address.split(":");
    connections.push(ip[ip.length - 1] + ":" + endpoint.port);

    socket.on('disconnect', function () {
      debug.log('A user disconnected', DEV);
    });

    socket.on('message', function (data, from) {
     console.log('I received a message', ' saying ', data);
  });

      socket.on('event', function (data) {
        EventHandler.handleEvent(data);
  });

  });


  //FILE RECEIVING SINGLE CONNECTION
  io_file_server.on('connection', function(socket){
    socket.emit('message', "I acknowledge your connection");
    socket.on('message', function(data){
      socket.emit('message', "I am alive (Sent By: single socket server)");
    });

    socket.on('event', function(data){
      EventHandler.handleEvent(data);
      console.log("Now as a server I am gonna respond as: I am alive");
      socket.emit('message', "Event Successfully Received (Sent By: single socket server)");
    });

    ss(socket).on('file', function(stream, data) {
      // var filename = path.basename(data.name);
      stream.pipe(fs.createWriteStream(data.name));
      console.log("File Written");
    });

    socket.on('request_file', function(path){
      var stream = ss.createStream();
      ss(socket).emit('request_file', stream, {name: path});
      fs.createReadStream(path).pipe(stream);
      console.log("Requested file sent to the node");
    });

  });

}

export function requestFile(IP, path){
  var socket = io_file_client.connect('http://' + IP + ':' + '4000/');
  console.log("Trying to connect to a single server....");
  socket.on('connect', function(){
      //FILE TRANSFER
      console.log("Connected to a single node");
  });
  ss(socket).on('request_file', function(stream, data){
    stream.pipe(fs.createWriteStream(data.name));
    console.log("File Written");

  });
  socket.emit("request_file", path);
}

export function sendMessage(IP, message){
  var socket = io_file_client.connect('http://' + IP + ':' + '4000/');
  console.log("Trying to connect to a single server....");
  socket.on('connect', function(){
      //FILE TRANSFER
      console.log("Connected to a single node");
  });
  socket.on('message', function(data){
    console.log("Port 4000 message: ", data);
  });
  socket.emit("message", message);
}

export function sendEvent(IP, message){
  var socket = io_file_client.connect('http://' + IP + ':' + '4000/');
  console.log("Trying to connect to a single server....");
  socket.on('connect', function(){
      //FILE TRANSFER
      console.log("Connected to a single node");
  });
  socket.on('event', function(data){
    console.log("Port 4000 event: ", data);
  });
  socket.emit("event", message);
}

export function sendFile(IP, path){
  var socket = io_file_client.connect('http://' + IP + ':' + '4000/');
  console.log("Trying to connect to a single server....");
  socket.on('connect', function(){
      //FILE TRANSFER
      console.log("Connected to a single node...");
  });
  socket.on('file', function(data){
    console.log("Port 4000 file received: ", data);
  });
  var stream = ss.createStream();
  var filename = path;

ss(socket).emit('file', stream, {name: filename});
fs.createReadStream(filename).pipe(stream);
console.log("File sent to server...");
  // fs.readFile(path, function(err, buff){
  //   socket.emit('file', {buffer: buff, file_path:path});
  //   console.log('File sent to server', buff);
  // });
}

export function getIO(){
  return io;
}


export function broadcast(tag, msg) {
  io.emit(tag, msg);
  serv_sock.map((val) => {val.emit(tag, msg);})
}
