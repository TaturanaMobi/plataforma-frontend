import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

if (Meteor.isClient) {
  Template.admSession.helpers({
    user: function (userId) {
      return Meteor.users.findOne({ _id: userId });
    },
  });
}
