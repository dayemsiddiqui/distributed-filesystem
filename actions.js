var fs = require('fs');
import {DEV, ROOT} from './header';
import debug from './debug';
import {config} from './config';
import {FILE_TABLE} from './fileTable'
import {EventHandler} from './eventHandler';
import {sendEvent} from './connection';
import {areEqual} from './utility';
var FullPath = require('fullpath');
var AsciiTable = require('ascii-table')
const util = require('util');;


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
    var stats = fs.statSync("./"+path);
    var mtime = new Date(util.inspect(stats.mtime));
		var f =
        {
  	      'F_ID': './'+path,
  	    	'F_NAME': dir,
  	    	'TIME_STAMP': mtime,
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
    var stats = fs.statSync("./"+path);
    var mtime = new Date(util.inspect(stats.mtime));
		var f =
        {
	        'F_ID': './'+path,
	    	'F_NAME': file,
	    	'TIME_STAMP': mtime,
	    	'NODE_LIST': [config.my_addr],
	        'DIRECTORY':  false,
          'DELETED' : false,
          'DELETED_BY' : [],
        };
        debug.log(path, DEV);
        FILE_TABLE.GLOBAL.push(f);
	}

    EventHandler.broadcastEvent('BRDCST_FILE_TBL',{});
    EventHandler.broadcastEvent('REQ_FILE_TABLE',{});
}

static showFileTable(){
   var table = new AsciiTable('GLOBAL FILE TABLE')
      table
      .setHeading('F_ID', 'F_NAME','IS_DIR','IS_DEL','TIME_STAMP', 'NODES', 'DELETED_BY');
      FILE_TABLE.GLOBAL.forEach(file => {
        table.addRow(file.F_ID, file.F_NAME, file.DIRECTORY, file.DELETED, file.TIME_STAMP, file.NODE_LIST, file.DELETED_BY);
      });
      process.stdout.write('\n');
      process.stdout.write(table.toString()+'\n');
	debug.log(table.toString()+'\n', DEV)
}

static deleteFile(fileName){
  for (var i = 0; i<FILE_TABLE.GLOBAL.length; i++){
    if((FILE_TABLE.GLOBAL[i].F_ID) == (PATH+'/'+fileName)){
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
      console.log("IN DELETED");
      var nodes = config.server_addr;
      nodes.push(config.my_addr);
      if (areEqual(nodes, FILE_TABLE.GLOBAL[i].DELETED_BY)){
        fs.unlink(FILE_TABLE.GLOBAL[i].F_ID);
        console.log("DELETED A FILE")
      FILE_TABLE.GLOBAL.pop
      (i);
      }
      
    }
  }
}


static reflectChanges(){

  for ( var i = 0;i<FILE_TABLE.GLOBAL.length;i++)
  {
    var file = FILE_TABLE.GLOBAL[i];
    var present = false;
     if(!file.DIRECTORY){ continue; }
          console.log("Creating File: "+ file.F_ID, DEV)
          if (!fs.existsSync(file.F_ID)){
          fs.mkdirSync(file.F_ID);
        }
  }
}


static sendFileTable(ip){
  sendEvent(ip, {event:'UPDATE_FILE_TBL', fileTable: FILE_TABLE.GLOBAL})
}

}
