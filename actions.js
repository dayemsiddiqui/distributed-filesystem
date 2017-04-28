var fs = require('fs');
import {DEV, ROOT} from './header';
import debug from './debug';
import {config} from './config';
import {FILE_TABLE} from './fileTable'
import {EventHandler} from './eventHandler';
var FullPath = require('fullpath');
var AsciiTable = require('ascii-table');

var PATH = ROOT;
export class Actions {

  static listFiles() {
    debug.log("List all the files: ",DEV);

    fs.readdir(PATH, (err, files) => {
      var table = new AsciiTable('Directory Listing')
      table
      .setHeading('', 'Files And Folders');
      var i = 1;
      files.forEach(file => {
        table.addRow(i, file);
        i++;
      });
      process.stdout.write('\n');
      process.stdout.write(table.toString()+'\n');
    });

  }

  static createFile(fileName){
    fs.writeFile(PATH+'/'+fileName, "", function(err) {
    if(err) {
        return console.log(err);
    }else{
        debug.log("The file was saved!", DEV);
    }
  });
    EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
  }

  static createDirectory(dirName){
    try {
      fs.mkdirSync(PATH+'/'+dirName);
      var f =
      {
          'F_ID': PATH+'/'+dirName,
          'F_NAME': dirName,
          'TIME_STAMP': new Date().toString(),
          'NODE_LIST': [config.my_addr],
          'DIRECTORY':  true,
          'DELETED' : false,
          'DELETED_BY' : [],
      };
      FILE_TABLE.GLOBAL.push(f);
      EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
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
	const fullPaths = new FullPath.Search({
	    'path': '/root',
	    'dirname': __dirname,
	    'type': 'both', //optional. If you don't specified this value, by default is set with 'files'
	    'allFiles': true //optional. If you don't specified this value, by default is set with false and the result was full path of files with .js and .json extension.
	});
	for(var i = 0; i<fullPaths.pathFolders.length ; i++){
		var trunc = fullPaths.pathFolders[i].indexOf('root/');
		var path = fullPaths.pathFolders[i].substr(trunc);
		var trunc = fullPaths.pathFolders[i].lastIndexOf('/');
		var dir = fullPaths.pathFolders[i].substr(trunc+1);
		console.log(file);
		var f =
        {
  	      'F_ID': path,
  	    	'F_NAME': dir,
  	    	'TIME_STAMP': new Date().toString(),
  	    	'NODE_LIST': [config.my_addr],
	        'DIRECTORY':  true,
          'DELETED' : false,
          'DELETED_BY' : [],

        };
        debug.log(path, DEV);
        FILE_TABLE.GLOBAL.push(f);
	}
	for(var i = 0; i<fullPaths.pathFiles.length ; i++){
		var trunc = fullPaths.pathFiles[i].indexOf('root/');
		var path = fullPaths.pathFiles[i].substr(trunc);
		var trunc = fullPaths.pathFiles[i].lastIndexOf('/');
		var file = fullPaths.pathFiles[i].substr(trunc+1);
		console.log(file);
		var f =
        {
	        'F_ID': path,
	    	'F_NAME': file,
	    	'TIME_STAMP': new Date().toString(),
	    	'NODE_LIST': [config.my_addr],
	        'DIRECTORY':  false,
          'DELETED' : false,
          'DELETED_BY' : [],
        };
        debug.log(path, DEV);
        FILE_TABLE.GLOBAL.push(f);
	}

	// fs.readdir(PATH, (err, files) => {
	// //OLD	
 //      files.forEach(file => {
 //      	var my_ip = config.my_addr;
 //        var f =
 //        {
 //        	'F_ID': PATH + file,
 //    			'F_NAME': file,
 //    			'TIME_STAMP': new Date().toString(),
 //    			'NODE_LIST': [my_ip],
 //          'DIRECTORY':  fs.statSync(PATH+file).isDirectory(),
 //        };
 //        debug.log(config.my_addr, DEV);
 //        FILE_TABLE.GLOBAL.push(f);

 //      });
 //    });

    EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
}

static showFileTable(){
   var table = new AsciiTable('GLOBAL FILE TABLE')
      table
      .setHeading('F_ID', 'F_NAME','IS_DIR','IS_DEL','TIME_STAMP', 'NODES');
      FILE_TABLE.GLOBAL.forEach(file => {
        table.addRow(file.F_ID, file.F_NAME, file.DIRECTORY, file.DELETED, file.TIME_STAMP, file.NODE_LIST);
      });
      process.stdout.write('\n');
      process.stdout.write(table.toString()+'\n');
	debug.log(table.toString()+'\n', DEV)
}

static deleteFile(fileName){
  for (var i = 0; i<FILE_TABLE.GLOBAL.length; i++){
    if(('./'+FILE_TABLE.GLOBAL[i].F_ID) == (PATH+'/'+fileName)){
      FILE_TABLE.GLOBAL[i].DELETED = true;
      FILE_TABLE.GLOBAL[i].DELETED_BY.push(config.my_addr);
      if(FILE_TABLE.GLOBAL[i].DIRECTORY == true){
        this.deleteDir(fileName);
      }
      console.log(FILE_TABLE.GLOBAL[i].F_NAME+ " deleted");
  }
}
  debug.log(FILE_TABLE.GLOBAL, DEV);
  EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
}

static deleteDir(dir){
  for (var i = 0; i<FILE_TABLE.GLOBAL.length; i++){
    if(FILE_TABLE.GLOBAL[i].F_ID.includes(dir)){
      FILE_TABLE.GLOBAL[i].DELETED = true;
      FILE_TABLE.GLOBAL[i].DELETED_BY.push(config.my_addr);
    }
  }
}

static actualDelete(){
  for (var i = 0; i<FILE_TABLE.GLOBAL.length; i++){
    if(FILE_TABLE.GLOBAL[i].DELETED){
      a1 = sort(config.server_addr);
      a2 = sort(FILE_TABLE.GLOBAL[i].DELETED_BY)
      if (JSON.stringify(a1) === JSON.stringify(a2)){
        
      }
      
    }
  }
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
          debug.log("Creating File: "+ file.F_ID, DEV)
          if (!fs.existsSync(file.F_ID)){
          fs.mkdirSync(file.F_ID);
        }

        }
      }
    }
  }
}

}
