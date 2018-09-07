import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

if (Meteor.isClient) {
  Template.admSession.helpers({
    user(userId) {
      return Meteor.users.findOne({
        _id: userId,
      });
    },
  });
}
