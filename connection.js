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
  io_file_server.sockets.on('connection', function(socket){

    var delivery = dl.listen(socket);
    delivery.on('receive.success',function(file){

      fs.writeFile(file.name, file.buffer, function(err){
        if(err){
          console.log('File could not be saved: ' + err);
        }else{
          console.log('File ' + file.name + " saved");
        };
      });
    });
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

}

export function getIO(){
  return io;
}


export function broadcast(tag, msg) {
  io.emit(tag, msg);
  serv_sock.map((val) => {val.emit(tag, msg);})
}

export function singleTransfer(F_ID, F_NAME, IP){
  var socket = io_file_client.connect('http://' + IP + ':' + '4000');
  socket.on('connect', function(){
      //FILE TRANSFER

      delivery = dl.listen( socket );
      delivery.connect();
      delivery.on('delivery.connect',function(delivery){
        delivery.send({
          name: F_NAME,
          path: F_ID.split("/").slice(0,-2).join("/") + "/",
        });

        delivery.on('send.success',function(file){
          debug.log('File sent successfully!');
        });
      });
  });
  socket.disconnect();
}
