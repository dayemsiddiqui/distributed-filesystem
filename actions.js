var fs = require('fs');
import {DEV, ROOT} from './header';
import debug from './debug';
import {config} from './config';
import {FILE_TABLE} from './fileTable'
import {EventHandler} from './eventHandler';

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

static initializeFileTable(){
	fs.readdir(PATH, (err, files) => {
      files.forEach(file => {
      	var my_ip = config.my_addr;
        var f =
        {
        	'F_ID': file,
			'F_NAME': file,
			'TIME_STAMP': new Date().toString(),
			'NODE_LIST': [my_ip],
      'DIRECTORY':  fs.statSync(PATH+file).isDirectory(),
        };
        console.log(config.my_addr);
        FILE_TABLE.GLOBAL.push(f);

      });
    });

    EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
}

static showFileTable(){
	console.log(FILE_TABLE.GLOBAL)
}

}
