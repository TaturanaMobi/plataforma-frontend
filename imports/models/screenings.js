import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import Schemas from './schemas';
import './images';
import Films from './films';
import Users from './users';
import statisticsDenormalizer from './denormalizers/statistics';

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

// fields: {
//   filmId: 1,
//   user_id: 1,
//   place_name: 1,
//   city: 1,
//   uf: 1,
//   date: 1,
//   public_event: 1,
//   team_member: 1,
//   quorum_expectation: 1,
//   comments: 1,
//   accept_terms: 1,
//   created_at: 1,
//   status: 1,
//   real_quorum: 1,
//   report_description: 1,
//   author_1: 1,
//   report_image_1: 1,
//   author_2: 1,
//   report_image_2: 1,
//   author_3: 1,
//   report_image_3: 1,
// },

if (Meteor.isServer) {
  Screenings.after.insert((userId, doc) => {
    statisticsDenormalizer.afterInsertScreening(doc);
  });
}

export default Screenings;
