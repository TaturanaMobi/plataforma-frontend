// import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import Films from './../../models/films.js';
import './about.html';

Template.about.helpers({
  portfolio() {
    return Films.portfolio();
  },
});
