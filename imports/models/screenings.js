// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';
import './images';
import Films from './films';
import Users from './users';

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

Screenings.after.insert(function afterInsert(userId, doc) {
  console.log('Criando notificação de inicio:', doc);
});

Screenings.after.update(function afterUpdate(userId, doc, fieldNames, modifier, options) {
  console.log('Verificando qual notificação criar:', doc);
}, { fetchPrevious: false });

export default Screenings;
