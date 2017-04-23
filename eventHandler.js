import debug from './debug';
import {DEV} from './header';
import {FILE_TABLE} from './'

export class EventHandler {

  constructor(){

  }

  static handleEvent(event, params){

    switch (event)
      {
         case 'DOWN_FILE':  debug.log(event + ' handled', DEV);

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

         case 'REQ_FILE_TABLE': debug.log(event + ' handled', DEV);
         break;

         case 'FORCE_UPDATE': debug.log(event + ' handled', DEV);
         break;

         case 'SEND_FILE_TABLE': debug.log(event + ' handled', DEV);
         break;

         case 'UPLOAD_FILE': debug.log(event + ' handled', DEV);

         case 'UPDATE_LOCAL_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'UPDATE_LOCAL_FILE': debug.log(event + ' broadcasted', DEV);
         break;

         delivery = dl.listen( socket );
          delivery.connect();

          delivery.on('delivery.connect',function(delivery){
            delivery.send({
              name: params.f_name,
              path : PATH,
            });

            delivery.on('send.success',function(file){
              console.log('File sent successfully!');
            });

          });

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
         break;

         case 'FORCE_UPDATE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'SEND_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'UPLOAD_FILE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'UPDATE_LOCAL_FILE_TABLE': debug.log(event + ' broadcasted', DEV);
         break;

         case 'UPDATE_LOCAL_FILE': debug.log(event + ' broadcasted', DEV);
         break;

         default:  debug.log(event + ' broadcasted', DEV);
      }
  }

  updateLocalFile(obj){
    var local_file = {
      F_ID : obj.F_ID,
      F_NAME : obj.FNAME,
      FS_DWNLD_TIME : obj.FS_DWNLD_TIME,
    }

    FILE_TABLE.LOCAL.push(local_file);
  }

}
