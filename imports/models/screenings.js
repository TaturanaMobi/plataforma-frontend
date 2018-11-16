// import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import Schemas from './schemas';
import './images';
import Films from './films';
import Users from './users';

const Screenings = new Mongo.Collection('screenings');
Screenings.attachSchema(Schemas.Screening);
Screenings.allow({
  insert(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
});
Screenings.helpers({
  film() {
    return Films.findOne(this.filmId);
  },
  ambassador() {
    return Users.findOne(this.user_id);
  },
});

export default Screenings;
