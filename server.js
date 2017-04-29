import {getAnotherCommand} from './parser';
import {initServer} from './connection';
import {Actions} from './actions';
var watch = require('watch');
var figlet = require('figlet');

const main = () => {

  watch.createMonitor('./root', function (monitor) {
    monitor.files['./root/*'] // Stat object for my zshrc.
    monitor.on("created", function (f, stat) {
      // Handle new files
      console.log(f, " created");
      Actions.initializeFileTable();
    })
    monitor.on("changed", function (f, curr, prev) {
      // Handle file changes
      console.log(f, " changed");
    })
    monitor.on("removed", function (f, stat) {
      // Handle removed files
      console.log(f, " removed");
    })
    // monitor.stop(); // Stop watching
  });

  figlet('Gormint FS', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
  });
  initServer();
  Actions.initializeFileTable();
  getAnotherCommand();

}

main();
