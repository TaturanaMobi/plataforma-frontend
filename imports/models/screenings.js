import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Schemas from './schemas';
import './images';
import Films from './films';
import Users from './users';
import statisticsDenormalizer from './denormalizers/statistics';
import Notifications from './notifications';
import NotificationTemplates from './notification_templates';

const Screenings = new Mongo.Collection('screenings');
Screenings.attachSchema(Schemas.Screening);

Screenings.allow({
  insert(userId, doc) {
    // The user must be logged in and the document must be owned by the user.
    return userId && doc.user_id === userId;
  },

  update(userId, doc) {
    // Can only change your own documents.
    return doc.user_id === userId;
  },

  remove(userId, doc) {
    // Can only remove your own documents.
    return doc.user_id === userId;
  },

  fetch: ['user_id'],
});

Screenings.helpers({
  film() {
    return Films.findOne(this.filmId);
  },
  ambassador() {
    return Users.findOne(this.user_id);
  },
});

if (Meteor.isServer) {
  Screenings.after.insert((userId, doc) => {
    if (doc.team_member) {
      const nt = NotificationTemplates.findOne({ trigger: 'request_director_presence' });
      const vars = {
        notificationTemplateId: nt._id,
        userId: doc.user_id,
        screeningId: doc._id,
        to: Films.findOne(doc.filmId).productionCompanyEmail,
      };
      // Notifications.attachSchema(Schemas.Notification);
      Notifications.insert(vars);
    }
  });
  Screenings.after.update((userId, doc) => {
    statisticsDenormalizer.afterInsertScreening(doc);
  });
}

export default Screenings;
