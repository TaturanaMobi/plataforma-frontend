import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

// import getSelectOptions from '../../models/schemas/getSelectOptions';
import { Cities } from '../../models/states_and_cities';
import './ambassadorFormFields.html';

Template.ambassadorFormFields.helpers({
  cities() {
    const c = Cities.find({});
    const d = [];
    c.forEach(item => d.push({
      label: item.nome,
      value: item.nome,
    }));
    return d;
  },
});

Template.ambassadorFormFields.events({
  'change select[name="profile.uf"]'(event) {
    Meteor.subscribe('cities', event.currentTarget.value);
  },
});

Template.ambassadorFormFields.onCreated(function () {
  this.autorun(() => {
    this.subscribe('cities', (this.parent().data ? this.parent().data.profile.uf : ''));
  });
});
