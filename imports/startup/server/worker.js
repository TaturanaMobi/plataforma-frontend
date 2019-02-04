import { Meteor } from 'meteor/meteor';
import processScreenings from './processScreenings';

const Worker = {
  start() {
    Meteor.setInterval(() => {
      Worker.run();
    }, 60000);
  },
  run() {
    if (process.env.WORKER !== undefined && process.env.WORKER === '1') {
      console.log('Iniciando worker...');
      processScreenings.autoStart();
    } else {
      console.log('Worker desativado...');
    }
  },
  stop() {
    Meteor.clearInterval();
  },
};

export default Worker;
