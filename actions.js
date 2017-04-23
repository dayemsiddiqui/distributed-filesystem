var fs = require('fs');
import {DEV, ROOT} from './header';
import debug from './debug';

var PATH = ROOT; 
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

  static createDirectory(dirName){
    try {
      fs.mkdirSync(PATH+dirName);
    } catch(e) {
      if (e.code != 'EEXIST') throw e;
    }
  }

  static currentDirectory(){
    console.log("Current Directory: " + PATH);
  }

  static changeDirectory(str){
    if(str == ".."){
      PATH =  PATH.split("/").slice(0,-2).join("/") + "/";
    }else{
      if (fs.existsSync(PATH + '/' + str)) {
          PATH = PATH + '/' + str;
      }else{
        console.warn("Directory does not exist");
      }

    }
  }

}
