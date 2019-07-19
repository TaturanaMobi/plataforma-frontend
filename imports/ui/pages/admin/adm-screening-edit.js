/* global document, window */

// import { Meteor } from 'meteor/meteor';
// import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

// import { saveScreening } from '../../../startup/client/helpers.js';
import '../../components/screeningFormFields';
import './adm-screening-edit.html';

Template.editScreening.onRendered(() => {
  // const nowDate = new Date();
  // const today = new Date(
  //   nowDate.getFullYear(),
  //   nowDate.getMonth(),
  //   nowDate.getDate() + 3,
  //   0, 0, 0, 0
  // );

  // $('.readonly').keydown(function readOnlyKeyDown(e) {
  //   e.preventDefault();
  // });
  $("a[rel^='prettyPhoto']").prettyPhoto();
});

Template.editScreening.events({
  // 'submit form#edit-screening-form'(event) {
  //   // Envia screening
  //   event.preventDefault();
  //   const form = document.getElementById('edit-screening-form');
  //   saveScreening(form, this.film._id, false, 'publish');
  // },
  // 'click #btn-save'(event) {
  //   // Salva como rascunho
  //   event.preventDefault();
  //   const form = document.getElementById('edit-screening-form');
  //   const draft = $('#btn-save').attr('data-status');
  //   saveScreening(form, this.film._id, draft, 'update');
  // },
  // 'click .remove_address'() {
  //   Meteor.call('removeAddress', Meteor.user()._id, this);
  // },
  // 'click .replace_address'() {
  //   // set state
  //   $('#uf').find(`#${this.uf}`).attr('selected', 'selected');
  //   // Session.set('address', this);
  // },
});

Template.editScreening.helpers({
  // form() {
  //   return this;
  // },
  // film() {
  //   // console.log(this);
  //   return this.film().fetch();
  // },

  // user_addresses() {
  //   if (!Meteor.user()) return;
  //   return Meteor.user().addresses;
  // },
  // address(replace_address) {

  //   if (!Session.get('address')) {
  //     const saved_address = {
  //       cep: this.screening.cep,
  //       city: this.screening.city,
  //       complement: this.screening.complement,
  //       number: this.screening.number,
  //       place_name: this.screening.place_name,
  //       uf: this.screening.uf,
  //       street: this.screening.street,
  //       zone: this.screening.zone,
  //       s_country: this.screening.s_country,
  //     };

  //     // Session.set('address', saved_address);
  //   }

  //   return Session.get('address');
  // },
  // is_selected(state) {
  //   const address = Session.get('address');

  //   if (!address) return;
  //   console.log(address.uf, state);
  //   if (address.uf === state) {
  //     return 'selected';
  //   }
  // },
  is_draft() {
    return this.screening.draft;
  },
});
