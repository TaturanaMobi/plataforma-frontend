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
}

export default NotificationTemplates;
