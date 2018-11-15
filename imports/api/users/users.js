import { Meteor } from 'meteor/meteor';
import Schemas from '../schemas';
// import '../../api/images/images';
// import Films from '../films/films';

const Users = Meteor.users;
Users.attachSchema(Schemas.User);
// Users.helpers({
//   film() {
//     return Films.findOne(this.filmId);
//   },
//   ambassador() {
//     return Users.findOne(this.user_id);
//   }
// });

export default Users;
