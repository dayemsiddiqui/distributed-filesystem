import { FILE_TABLE }  from './fileTable';
import { config } from './config';
import { EventHandler } from './eventHandler';
import {Actions} from './actions';
import {DEV, ROOT} from './header';
import debug from './debug';
import {requestFile} from './connection';
var FullPath = require('fullpath');

export var diffFileTable = (receivedFileTable) => {
  var isUpdated = false;
  debug.log("In Diff Algo: ", DEV);

  //File Does not exist
  receivedFileTable.map((obj)=>{
    // obj.F_ID
    var isPresent = false;
    FILE_TABLE.GLOBAL.forEach(function(myObj) {
      if(myObj.F_ID == obj.F_ID){
        debug.log(obj, "is present", DEV);
        isPresent = true;
      }
    });

    if(!isPresent){
      //If file is not present then add
      //TODO: implement a check if your ip address already exists in the NODE_LIST
      obj.NODE_LIST.push(config.my_addr);
      if(obj.DELETED){
        obj.DELETED_BY.push(config.my_addr);
      }
      FILE_TABLE.GLOBAL.push(obj);
      isUpdated = true;
    }
  });

  //File Exists local but the given node doesnt exists

  //If GLOBAL File Table is updated then broadcastEvent
  if(isUpdated){
    EventHandler.broadcastEvent('BRDCST_FILE_TBL', {});
    Actions.reflectChanges();
    syncFiles();
  }
}

export var syncFiles = () => {
  const fullPaths = new FullPath.Search({
	    'path': '/root',
	    'dirname': __dirname,
	    'type': 'both', //optional. If you don't specified this value, by default is set with 'files'
	    'allFiles': true //optional. If you don't specified this value, by default is set with false and the result was full path of files with .js and .json extension.
	});

  var local_files = [];
	for(var i = 0; i<fullPaths.pathFiles.length ; i++){
		var trunc = fullPaths.pathFiles[i].indexOf('root/');
		var path = fullPaths.pathFiles[i].substr(trunc);
    local_files.push(path);
  }
  FILE_TABLE.GLOBAL.map((obj) => {
    var isPresent = false;
    local_files.forEach(function(myObj) {
      if(obj.F_ID == myObj){
        debug.log(obj, "is present", DEV);
        isPresent = true;
      }
    });

    if(!isPresent && !obj.DELETED){
      var ip = '';
      if(obj.NODE_LIST[0] != config.my_addr){
           ip = obj.NODE_LIST[0];
      }else{
        ip = obj.NODE_LIST[1];
      }
      console.log("Requesting file from ", ip, obj);
      requestFile(ip, obj.F_ID);
    }

  });



}
