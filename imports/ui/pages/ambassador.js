import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
// import { Router } from 'meteor/iron:router';
import { _ } from 'meteor/underscore';
// import { moment } from 'meteor/momentjs:moment';

import Films from './../../models/films';
import Screenings from './../../models/screenings';
import './ambassador.html';
import './../components/ambassadorFormFields.js';

Template.ambassador.helpers({
  screenings() {
    return Screenings.find({ user_id: Meteor.userId() });
  },
  disseminate() {
    return Films.disseminate();
  },
  session_status_icon(screening) {
    // Rascunho
    if (screening.draft) {
      return 'edit';
    }

    // Agendada
    const today = new Date();

    if (today.getTime() < screening.date.getTime()) {
      return 'calendar';
    }

    // Completo
    if (_.has(screening, 'report_description')) {
      return 'complete';
    }

    // Falta relatório
    return 'report-pending';
  },
  in_future(screening) {
    const today = new Date();

    return (today.getTime() < screening.date.getTime() || screening.draft == 'admin-draft');
  },
  is_report_pending(screening) {
    return !_.has(screening, 'report_description');
  },
});
Template.ambassador.events({
  'click .destroy'() {
    Meteor.call('removeScreening', this._id);
  },
});


export function messageError(reason) {
  let message = '';
  if (reason === 'Email already exists.') {
    message = 'Já existe um cadastro vinculado a este e-mail!';
  } else {
    message = 'Ocorreu um erro na criação do seu usuário!';
  }
  $('.form-errors').append(message);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}
