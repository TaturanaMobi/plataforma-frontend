import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';

const NotificationTemplates = new Mongo.Collection('notification_templates');
NotificationTemplates.attachSchema(Schemas.NotificationTemplate);

if (Meteor.isServer) {
  NotificationTemplates.before.insert((userId, doc) => {
    doc.createdAt = Date.now();
  });
  NotificationTemplates.before.upsert((userId, doc) => {
    doc.updatedAt = Date.now();
  });

  NotificationTemplates.allow({
    insert(userId) {
      // only allow posting if you are logged in
      return !!userId;
    },
    update(userId) {
      // only allow posting if you are logged in
      return !!userId;
    },
  });
}

export default NotificationTemplates;
