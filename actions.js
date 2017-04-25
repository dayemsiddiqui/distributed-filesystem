var fs = require('fs');
import {DEV, ROOT} from './header';
import debug from './debug';
import {config} from './config';
import {FILE_TABLE} from './fileTable'
import {EventHandler} from './eventHandler';

var PATH = ROOT; 
export class Actions {

  static listFiles() {
    debug.log("List all the files: ",DEV);
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
        debug.log(config.my_addr, DEV);
        FILE_TABLE.GLOBAL.push(f);

      });
    });

    EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
}

static showFileTable(){
	debug.log(FILE_TABLE.GLOBAL, DEV)
}

static reflectChanges(){
  for ( var i = 0;i<FILE_TABLE.GLOBAL.length;i++)
  {
    var file = FILE_TABLE.GLOBAL[i];
    for (var j =0; j<FILE_TABLE.GLOBAL.length; j++)
    {
      if(file.DIRECTORY){
        var present = false;
        if(file.NODE_LIST[j] == config.my_addr){
          present = true;
          break;
        }
        if(!present){
          debug.log("Creating File: "+ F_ID, DEV)
          if (!fs.existsSync(PATH+file.F_ID)){
          fs.mkdirSync(PATH+file.F_ID);
        }

        }
      }
    }
  }
}

}
