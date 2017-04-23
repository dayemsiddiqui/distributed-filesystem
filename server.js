import {getAnotherCommand} from './parser';
import {initServer} from './connection';



const main = () => {
  initServer();
  getAnotherCommand();
}

main();
