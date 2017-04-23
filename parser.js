var prompt = require('prompt');
import {config} from './config';
import {listFiles} from './actions';

export const getAnotherCommand = () => {

  prompt.get( config.prompt, function(err, result) {
      if (err) console.error(err);
      else {
        // console.log(result);
        var statement = result.question.split(" ");
        var command = statement[0];
        if(command == 'message'){
            var message = statement[1];
            broadcast("message", message)
          }else if(command == 'ls'){
            listFiles();
          }
          getAnotherCommand();
      }
  });
}
