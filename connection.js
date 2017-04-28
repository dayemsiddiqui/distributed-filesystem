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

var serv_sock = []; // Used in broadcast function
var connections = [];

export function initServer(){

  for(var i = 0; i < config.server_addr.length; i++){
    if(config.server_addr[i] == config.my_addr) continue;
    var s_addr = 'http://' + config.server_addr[i] + ':3000/';
    serv_sock.push(io_client(s_addr));
  }



  http.listen(3000, function(){
    debug.log('Server started on port 3000', DEV);
  });


  //FILE RECEIVING
  io_file_server.on('connection', function(socket){
    socket.emit('message', "Here is your file");
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
  var socket = io_file_client.connect('http://' + '172.15.45.124' + ':' + '4000/');
  console.log("Trying to connect to a single server....");
  socket.on('connect', function(){
      //FILE TRANSFER
      console.log("Connected to a single node");
  });
  socket.on('message', function(data){
    console.log("Port 4000 message: ", data);
  });
  socket.emit("message", "Please send me the files")
}

export function getIO(){
  return io;
}


export function broadcast(tag, msg) {
  io.emit(tag, msg);
  serv_sock.map((val) => {val.emit(tag, msg);})
}
