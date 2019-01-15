import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';

const Notifications = new Mongo.Collection('notifications');
Notifications.attachSchema(Schemas.Notification);

Notification.before.insert(function beforeInsert(userId, doc) {
  doc.createdAt = Date.now();
});

Notification.after.insert(function afterInsert(userId, doc) {
  console.log('Enviando e-mail:', doc);
});

export default Notifications;
