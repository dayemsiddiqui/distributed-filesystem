var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');

var io = require('socket.io-client');

var socket = io('http://192.168.15.53:3000/');

var prompt = require('prompt');

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
