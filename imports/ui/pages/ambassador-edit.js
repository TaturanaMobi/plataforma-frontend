import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
// import { FlashMessages } from 'meteor/mrt:flash-messages';
import Screenings from '../../models/screenings';


import './ambassador-edit.html';

Template.ambassadorEdit.onCreated(function () {
  this.autorun(() => {
    this.subscribe('cities');
    this.subscribe('screenings.my');
  });
});

Template.ambassadorEdit.helpers({
  form() {
    return Meteor.users.findOne({ _id: Meteor.userId() });
  },
  // avatarData() {
  //   return { file_type: 'avatar_path' };
  // },
  amount_film_screenings() {
    const scrs = Screenings.find({}).fetch();
    const today = new Date();
    let pastScr = 0;
    let people = 0;
    _.each(scrs, (scr) => {
      if (scr.date.getTime() < today.getTime()) {
        if (scr.real_quorum) {
          people = parseInt(scr.real_quorum, 10) + people;
        }
        pastScr += 1;
      }
    });

    // console.log(pastScr, people);
    return { pastScr, people };
    // return {};
  },
  amount_films() {
    return Screenings.find({ userId: Meteor.userId() }).length;
  },
});

Template.ambassadorEdit.events({
  'click .destroy'() {
    Meteor.call('removeScreening', this._id);
  },
});
