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
