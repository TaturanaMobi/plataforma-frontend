import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';

const Notifications = new Mongo.Collection('notifications');
Notifications.attachSchema(Schemas.Notification);

if (Meteor.isServer) {
  Notifications.before.insert((userId, doc) => {
    doc.createdAt = Date.now();
  });
  Notifications.before.upsert((userId, doc) => {
    doc.updatedAt = Date.now();
  });
  Notifications.after.insert((userId, doc) => {
    console.log('Enviando e-mail:', doc);
  });
}

export default Notifications;
