import { Mongo } from 'meteor/mongo';
import Schemas from './../schemas';
import './../../api/images/images';
import Films from './../films/films';
import Users from './../users/users';

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
