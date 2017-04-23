var fs = require('fs');
import {PATH, DEV} from './header';
import debug from './debug';

export class Actions {

  static listFiles() {
    console.log("List all the files: ");
    fs.readdir(PATH, (err, files) => {
      files.forEach(file => {
        console.log(file);
      });
    });
  }

  static createFile(fileName){
    fs.writeFile(PATH+fileName, "", function(err) {
    if(err) {
        return console.log(err);
    }else{
        debug.log("The file was saved!", DEV);
    }
  });
  }

}
