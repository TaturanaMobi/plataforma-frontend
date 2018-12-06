import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
// import { FlashMessages } from 'meteor/mrt:flash-messages';

// import Films from './../../models/films.js';

import './ambassador-edit.html';

Template.ambassadorEdit.helpers({
  form() {
    return Meteor.users.findOne({ _id: Meteor.userId() });
  },
// avatarData() {
//   return { file_type: 'avatar_path' };
// },
// amount_film_screenings() {
// const scrs = Films.screenings_by_user_id(Meteor.userId());
// const today = new Date();
// let pastScr = 0;
// let people = 0;

// _.each(scrs, (scr) => {
//   if (scr.date.getTime() < today.getTime()) {
//     if (scr.real_quorum) {
//       people = parseInt(scr.real_quorum, 10) + people;
//     }
//     pastScr += 1;
//   }
// });

// return { pastScr, people };
// return {};
// },
// amount_films() {
//   return Films.by_user_id(Meteor.userId()).length;
// },
});

Template.ambassadorEdit.events({
  'click .destroy'() {
    Meteor.call('removeScreening', this._id);
  },
});
