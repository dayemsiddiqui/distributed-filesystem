
var fs = require('fs');
export const listFiles = () => {
  console.log("List all the files: ");
  fs.readdir('./', (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });
}
