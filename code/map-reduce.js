// Map Stub For Distributed Execution
export var _map = () => {
   //_map does not take any arguments

  //Your code goes here

  // Whatever you return will be passed to the reducer in an array as a argument
  // return something
  return 2;
}

//Reduce Stub For Aggregation of Map
export var _reduce = (arr) => {
  //Here arr is the array of objects returned by each map function
  // Your code goes here

  // return your result
  var sum = 0;
  arr.map((val) => {
    sum = sum + val;
  });
  return sum;
}
