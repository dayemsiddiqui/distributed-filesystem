var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var io_client = require('socket.io-client');
var readlineSync = require('readline-sync');
var prompt = require('prompt');
import {config} from './config';
import debug from './debug';
var DEV = false;

var serv_sock = [];
var connections = [];

for(var i = 0; i < config.server_addr.length; i++){
  if(config.server_addr[i] == config.my_addr) continue;
  var s_addr = 'http://' + config.server_addr[i] + ':3000/';
  serv_sock.push(io_client(s_addr));
  // connections.push(s_addr);
}



http.listen(3000, function(){
  debug.log('Sever started on port 3000', DEV);
});

io.on('connection', function(socket){
  debug.log('A user connected', DEV);
  var endpoint = socket.request.connection._peername;
  var ip = endpoint.address.split(":");
  connections.push(ip[ip.length - 1] + ":" + endpoint.port);
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    debug.log('A user disconnected', DEV);
  });

  socket.on('message', function (data, from) {
  //  socket.emit('serverMessage', 'Got a message!');
   console.log('I received a message by ', ' saying ', data);
});

});

function broadcast(tag, msg) {
  io.emit(tag, msg);
  serv_sock.map((val) => {val.emit(tag, msg);})
}

function getAnotherCommand() {
    prompt.get( config.prompt, function(err, result) {
        if (err) done(err);
        else {
          // console.log(result);
          var command = result.question.split(" ");
          if(command == 'ls_conn'){
              console.log("Total connections: ", connections.length);
              console.log("Here is the list of connected sockets: ");
              connections.map((val) => { console.log(val); });
              broadcast("message", "Hello World")
            }
            getAnotherCommand();
        }
    })
}

function done(err) {
    // console.error(err);
}

const main = () => {
  getAnotherCommand();
}

main();
