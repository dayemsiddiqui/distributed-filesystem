var prompt = require('prompt');
import {config} from './config';
import debug from './debug';
import {DEV} from './header';
import {getIO} from './connection';
import {Actions} from './actions';
import {EventHandler} from './eventHandler';

export const getAnotherCommand = () => {

  prompt.get( config.prompt, function(err, result) {
      if (err) console.error(err);
      else {
        // console.log(result);
        var statement = result.question.split(" ");
        var command = statement[0];
        if(command == 'ls'){
          debug.log("Another Command: ls", DEV)
          Actions.listFiles();
        }
        else if(command == 'mkdir'){
          debug.log("Another Command: mkdir", DEV)
          Actions.createDirectory(statement[1]);
        }
        else if(command == 'pwd'){
          debug.log("Another Command: pwd", DEV)
          Actions.currentDirectory();
        }
        else if(command == 'cd'){
          debug.log("Another Command: cd", DEV)
          Actions.changeDirectory(statement[1]);
        }
        else if(command == 'touch'){
          debug.log("Another Command: touch", DEV);
          Actions.createFile(statement[1]);
        }
        else if(command == 'exit'){
          process.exit(0);
          console.log("Exited");
        }
        else{
          if(DEV){
            if(command == 'FILE_TABLE'){
              Actions.showFileTable();
            }
            if(command == 'upload'){
              //EventHandler.handleEvent('UPLOAD_FILE',{'f_name':'hello.txt'});
              //getIO().emit('event', {'event':'UPLOAD_FILE', 'f_name':'hello.txt'});
            }
            if(command == 'message'){
              EventHandler.broadcastEvent('USR_MSG',{'message':statement[1]});
            }
          }
          //invalidCommand();
        }
          getAnotherCommand();
        }

  });
}
