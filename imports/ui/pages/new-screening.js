
/* global document, window */

import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';
import Plyr from 'plyr';

import '../components/autoform-nouislider.js';
import '../components/screeningFormFields';
import './new-screening.html';
// import Screenings from '../../models/screenings.js';
// import { saveScreening } from '../../startup/client/helpers.js';

Template.newScreening.onCreated(function () {
  this.autorun(() => {
    this.subscribe('cities');
    this.subscribe('users.me');
  });
});

Template.newScreening.onRendered(() => {
  // const nowDate = new Date();
  // const today = new Date(nowDate.getFullYear(),
  // nowDate.getMonth(), nowDate.getDate() + 3, 0, 0, 0, 0);

  // $('.readonly').keydown(function(e) {
  //   e.preventDefault();
  // });
  // $('#date').datepicker({
  //   format: 'dd/mm/yyyy',
  //   language: 'pt-BR',
  //   startDate: today,
  // });
  // $('.datetimepicker').timepicker();
  const player = new Plyr('#player');
  player.volume = 1;
});

Template.newScreening.events({
  // 'submit form#new-screening-form'(event) {
  //   event.preventDefault();
  //   // Envia screening
  //   // TODO: add validation to the form
  //   const form = document.getElementById('new-screening-form');
  //   saveScreening(form, this._id, false, 'create-publish');
  // },
  // 'click #btn-save'(event) {
  //   // Salva coomo rascunho
  //   // TODO: add validation to the form
  //   event.preventDefault();
  //   const form = document.getElementById('new-screening-form');
  //   saveScreening(form, this._id, true, 'create');
  // },
  'click .remove_address'() {
    Meteor.call('removeAddress', Meteor.user()._id, this);
  },
  // 'click .replace_address': function() {
  //   // set state
  //   $('#uf')
  //     .find('#' + this.uf)
  //     .attr('selected', 'selected');
  //   Session.set('address', this);
  // }
});

Template.newScreening.helpers({
  form() {
    return {
      user_id: Meteor.userId(),
      filmId: this._id,
      created_at: new Date(),
      status: 'Agendada',
    };
  },
  user_addresses() {
    return Meteor.user().addresses;
  },
  address() {
    return [];
    // Session.get('address');
  },
});
