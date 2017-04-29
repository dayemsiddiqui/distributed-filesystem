import debug from './debug';
import {DEV} from './header';
import {FILE_TABLE} from './fileTable';
import {broadcast} from './connection';
import {diffFileTable} from './utility';
import { config } from './config';
import { Actions } from './actions';
import { _map } from './code/map-reduce';


export class EventHandler {

  constructor(){

  }

  static handleEvent(data){

    switch (data.event)
      {
         case 'DOWN_FILE':  debug.log(event + ' handled', DEV);
         var s_addr = 'http://192.168.1.2:3000/';
         socket = io_client(s_addr);
          var delivery = dl.listen(socket);
          delivery.on('receive.success',function(file){

            fs.writeFile(PATH+file.name, file.buffer, function(err){
              if(err){
                console.log('File could not be saved: ' + err);
              }else{
                console.log('File ' + file.name + " saved");
              };
            });
          });

         break;


         case 'FORCE_UPDATE': debug.log(data.event + ' handled', DEV);
         break;

         case 'SEND_FILE_TABLE':
         Actions.sendFileTable(data.ip);
         debug.log(data.event + ' handled', DEV);
         break;



         case 'UPDATE_LOCAL_FILE_TABLE':
         debug.log(data.event + ' broadcasted', DEV);
         break;

         case 'UPDATE_LOCAL_FILE': debug.log(data.event + ' broadcasted', DEV);
         break;

         case 'UPDATE_FILE_TBL':
         console.log("Received File Table");
         diffFileTable(data.fileTable);
         debug.log(data.event + ' handled', DEV);
         break;

         case 'EXECUTE':
         console.log("Job Completed (Result): ", _map());
         debug.log(data.event + ' handled', DEV);
         break;

         default:  debug.log(event + ' handled', DEV);
      }

  }

  static broadcastEvent(event, obj){
    switch (event)
      {
         case 'DOWN_FILE':  debug.log(event + ' broadcasted', DEV);
         break;

         case 'REQ_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         broadcast('event', {event:'SEND_FILE_TABLE', ip: config.my_addr})
         break;

         case 'FORCE_UPDATE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'EXECUTE':
         broadcast('event', {event:'EXECUTE' ,source: config.my_addr});
         debug.log(event + ' broadcasted', DEV);
         break;

         case 'BRDCST_FILE_TBL':
         broadcast('event', {event:'UPDATE_FILE_TBL' ,fileTable: FILE_TABLE.GLOBAL});
         debug.log(event + ' broadcasted', DEV);
         break;

         case 'USR_MSG':
         broadcast('message', obj.message);
         debug.log(event + ' broadcasted', DEV);
         break;

         default:  debug.log(event + ' broadcasted', DEV);
      }
  }

  updateLocalFile(obj){
    var doesExist = false;
    var local_file = {
      F_ID : obj.F_ID,
      F_NAME : obj.FNAME,
      FS_DWNLD_TIME : obj.FS_DWNLD_TIME,
    }
    FILE_TABLE.LOCAL.map((file) => {
      if(file.F_NAME == obj.F_NAME){
        file.FS_DWNLD_TIME = obj.FS_DWNLD_TIME;
      }
    });
    FILE_TABLE.LOCAL.push(local_file);
  }

}
