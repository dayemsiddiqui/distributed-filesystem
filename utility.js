import { FILE_TABLE }  from './fileTable';
import { config } from './config';
import { EventHandler } from './eventHandler';
import {Actions} from './actions';

export var diffFileTable = (receivedFileTable) => {
  var isUpdated = false;
  console.log("In Diff Algo: ");

  //File Does not exist
  receivedFileTable.map((obj)=>{
    // obj.F_ID
    var isPresent = false;
    FILE_TABLE.GLOBAL.forEach(function(myObj) {
      if(myObj.F_ID == obj.F_ID){
        console.log("Is Present");
        console.log(obj, "is present");
        isPresent = true;
      }
    });

    if(!isPresent){
      //If file is not present then add
      //TODO: implement a check if your ip address already exists in the NODE_LIST
      obj.NODE_LIST.push(config.my_addr);
      FILE_TABLE.GLOBAL.push(obj);
      isUpdated = true;
    }
  });

  //File Exists local but the given node doesnt exists

  //If GLOBAL File Table is updated then broadcastEvent
  if(isUpdated){
    EventHandler.broadcastEvent('BRDCST_FILE_TBL', {});
    Actions.reflectChanges();
  }
}
