var Console = require('console').Console;
var fs = require('fs')
var stream = fs.createWriteStream('tmp/mylog', {
  flags: 'w',
  defaultEncoding: 'utf8',
  fd: null,
  mode: 0o666,
  autoClose: true
});
var console = new Console(stream, stream);


var debug = {}
debug.log = (message, DEV) => {
  if(DEV){
  console.log(message);
  }
}

debug.err = (message, DEV) => {
  if(DEV){
  console.err(message);
  }
}

export default debug;
