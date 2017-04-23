import debug from './debug';
import {DEV} from './header';
export default class EventHandler {

  constructor(){

  }

  handleEvent(event){

    switch (event)
      {
         case 'DOWN_FILE':  debug.log(event + ' handled', DEV);
         break;

         case 'REQ_FILE_TABLE': debug.log(event + ' handled', DEV);
         break;

         case 'FORCE_UPDATE': debug.log(event + ' handled', DEV);
         break;

         case 'SEND_FILE_TABLE': debug.log(event + ' handled', DEV);
         break;

         case 'UPLOAD_FILE': debug.log(event + ' handled', DEV);
         break;

         default:  debug.log(event + ' handled', DEV);
      }

  }

  broadcastEvent(event, obj){
    switch (event)
      {
         case 'DOWN_FILE':  debug.log(event + ' broadcasted', DEV);
         break;

         case 'REQ_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'FORCE_UPDATE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'SEND_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'UPLOAD_FILE': debug.log(event + ' broadcasted', DEV);
         break;

         default:  debug.log(event + ' broadcasted', DEV);
      }
  }

}
