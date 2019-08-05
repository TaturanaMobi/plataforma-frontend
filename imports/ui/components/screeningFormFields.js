import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import { Cities } from '../../models/states_and_cities';
import './screeningFormFields.html';

Template.screeningFormFields.helpers({
  cities() {
    return Cities.find({}).map(item => ({
      label: item.nome,
      value: item.nome,
    }));
  },
});

Template.screeningFormFields.events({
  'change select[name="uf"]'(event) {
    Meteor.subscribe('cities', event.currentTarget.value);
  },
});

Template.screeningFormFields.onCreated(function () {
  this.autorun(() => {
    this.subscribe('cities', (this.parent().data ? this.parent().data.uf : ''));
  });
});
