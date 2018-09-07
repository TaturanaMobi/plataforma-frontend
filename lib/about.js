import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
  Template.about.helpers({
    portfolio() {
      return Films.portfolio();
    },
  });
}
