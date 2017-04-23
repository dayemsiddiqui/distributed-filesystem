import {getAnotherCommand} from './parser';
import {initServer} from './connection';
import {Actions} from './actions';


const main = () => {

  initServer();
  Actions.initializeFileTable();
  getAnotherCommand();
}

main();
