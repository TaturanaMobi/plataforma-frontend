import { Meteor } from 'meteor/meteor';
import processScreenings from './processScreenings';

const Worker = {
  start() {
    Meteor.setInterval(() => {
      Worker.run();
    }, 60000);
  },
  run() {
    console.log('Iniciando worker...');
    // processScreenings.autoStart();
  },
  stop() {
    Meteor.clearInterval();
  },
};

export default Worker;
