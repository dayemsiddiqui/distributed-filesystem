var prompt = require('prompt');
import {config} from './config';
import debug from './debug';
import {DEV} from './header';
import {listConnections} from './connection';
import {Actions} from './actions';
import {EventHandler} from './eventHandler';
import {singleTransfer} from './connection';
import {sendMessage, sendFile, requestFile} from './connection';

export const getAnotherCommand = () => {

  prompt.get( config.prompt, function(err, result) {
      if (err) console.error(err);
      else {
        // console.log(result);
        var statement = result.question.split(" ");
        var command = statement[0];
        var trunc = result.question.indexOf(' ');
        statement = result.question.substr(trunc);
        if(command == 'ls'){
          debug.log("Another Command: ls", DEV)
          Actions.listFiles();
        }
        else if(command == 'mkdir'){
          debug.log("Another Command: mkdir", DEV)
          Actions.createDirectory(statement);
        }
        else if(command == 'pwd'){
          debug.log("Another Command: pwd", DEV)
          Actions.currentDirectory();
        }
        else if(command == 'cd'){
          debug.log("Another Command: cd", DEV)
          Actions.changeDirectory(statement);
        }
        else if(command == 'touch'){
          debug.log("Another Command: touch", DEV);
          Actions.createFile(statement);
        }
        else if(command == 'rm'){
          debug.log("Another Command: remove", DEV)
          Actions.deleteFile(statement);
        }
        else if(command == 'exit'){
          process.exit(0);
          console.log("Exited");
        }

        else{
          if(DEV){
            statement = statement.split(" ");
            if(command == 'FILE_TABLE'){
              Actions.showFileTable();
            }
            if(command == 'upload'){
              // EventHandler.handleEvent('UPLOAD_FILE',{'f_name':'hello.txt'});
              singleTransfer('./root/hello/', 'hello', '172.15.45.124');
              // getIO().emit('event', {'event':'UPLOAD_FILE', 'f_name':'hello.txt'});
            }
            if(command == 'message'){
              EventHandler.broadcastEvent('USR_MSG',{'message':statement[0]});
            }
            if(command == 'LS_CONN'){
              listConnections();

            }
            if(command == 'single_message'){
              sendMessage(statement[1], statement[2]);
            }
            if(command == 'send_file'){
              sendFile(statement[1], statement[2]);
            }
            if(command == 'request_file'){
              requestFile(statement[1], statement[2]);
            }


        }
      }


          //invalidCommand();
        }
          getAnotherCommand();


  });
}
