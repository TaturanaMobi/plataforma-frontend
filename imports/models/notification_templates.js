import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';

const NotificationTemplates = new Mongo.Collection('notification_templates');
NotificationTemplates.attachSchema(Schemas.NotificationTemplate);

NotificationTemplates.before.insert(function beforeInsert(userId, doc) {
  doc.createdAt = Date.now();
});

export default NotificationTemplates;
