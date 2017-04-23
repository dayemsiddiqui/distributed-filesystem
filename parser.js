var prompt = require('prompt');
import {config} from './config';
import {listFiles} from './actions';
import debug from './debug';
import {DEV} from './header';


export const getAnotherCommand = () => {

  prompt.get( config.prompt, function(err, result) {
      if (err) console.error(err);
      else {
        // console.log(result);
        var statement = result.question.split(" ");
        var command = statement[0];
        if(command == 'ls'){
          debug.log("Another Command: ls", DEV)
          //listFiles();
        }
        else if(command == 'mkdir'){
          debug.log("Another Command: mkdir", DEV)
          //makeDirectory(statement[1]);
        }
        else if(command == 'pwd'){
          debug.log("Another Command: pwd", DEV)
          //currentDirectory();
        }
        else if(command == 'cd'){
          debug.log("Another Command: cd", DEV)
          //changeDirectory(statement[1]);
        }
        else if(command == 'touch'){
          debug.log("Another Command: touch", DEV)
          //createFile(statement[1]);
        }
        else{
          //invalidCommand();
        }
          getAnotherCommand();
        }
      
  });
}
