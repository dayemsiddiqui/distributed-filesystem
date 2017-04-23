var prompt = require('prompt');
import {config} from './config';
import {listFiles} from './actions';
import debug from './debug';
var DEV = true;


export const getAnotherCommand = () => {

  prompt.get( config.prompt, function(err, result) {
      if (err) console.error(err);
      else {
        // console.log(result);
        var statement = result.question.split(" ");
        var command = statement[0];
        if(command == 'ls'){
          debug.log("Another Commandl: ls", DEV)
          //listFiles();
        }
        else if(command == 'mkdir'){
          debug.log("Another Commandl: mkdir", DEV)
          //makeDirectory(statement[1]);
        }
        else if(command == 'pwd'){
          debug.log("Another Commandl: pwd", DEV)
          //currentDirectory();
        }
        else if(command == 'cd'){
          debug.log("Another Commandl: cd", DEV)
          //changeDirectory(statement[1]);
        }
        else if(command == 'touch'){
          debug.log("Another Commandl: touch", DEV)
          //createFile(statement[1]);
        }
        else{
          //invalidCommand();
        }
          getAnotherCommand();
        }
      
  });
}
