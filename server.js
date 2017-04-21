var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var io_client = require('socket.io-client');
var prompt = require('prompt');
import {config} from './config';

var serv_sock = [];

for(var i = 0; i < config.server_addr.length; i++){
  if(config.server_addr[i] == config.my_addr) continue;
  var s_addr = 'http://' + config.server_addr[i] + ':3000/';
  serv_sock.push(io_client(s_addr));
}




http.listen(3000, function(){
  console.log('Sever started on port 3000');
});

io.on('connection', function(socket){
  console.log('A user connected');
  socket.emit('news', { hello: 'world' });
  //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

});




const main = () => {
    prompt.start();
     prompt.get(['username', 'email'], function (err, result) {
    //
    // Log the results.
    //
    console.log('Command-line input received:');
    console.log('  username: ' + result.username);
    console.log('  email: ' + result.email);
  });
}

main();
