/* global document, window */

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import './../components/autoform-nouislider.js';
import './new-screening.html';
import { saveScreening } from './../../startup/client/helpers.js';

Template.newScreening.onRendered(() => {
  // const nowDate = new Date();
  // const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 3, 0, 0, 0, 0);

  // $('.readonly').keydown(function(e) {
  //   e.preventDefault();
  // });
  // $('#date').datepicker({
  //   format: 'dd/mm/yyyy',
  //   language: 'pt-BR',
  //   startDate: today,
  // });
  // $('.datetimepicker').timepicker();
  $('a[rel^="prettyPhoto"]').prettyPhoto();
});

Template.newScreening.events({
  // 'submit form#new-screening-form'(event) {
  //   event.preventDefault();
  //   // Envia screening
  //   // TODO: add validation to the form
  //   const form = document.getElementById('new-screening-form');
  //   saveScreening(form, this._id, false, 'create-publish');
  // },
  'click #btn-save'(event) {
    // Salva coomo rascunho
    // TODO: add validation to the form
    event.preventDefault();
    const form = document.getElementById('new-screening-form');
    saveScreening(form, this._id, true, 'create');
  },
  'click .remove_address'(event) {
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
      user_id: Meteor.user()._id,
      filmId: this._id,
      status: 'Agendada',
    };
  },
  user_addresses() {
    if (!Meteor.user()) return;

    return Meteor.user().addresses;
  },
  address(replace_address) {
    return Session.get('address');
  },
  is_selected(state) {
    const address = Session.get('address');

    if (!address) return;

    if (address.uf == state) {
      return 'selected';
    }
  }
});
