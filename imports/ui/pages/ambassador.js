import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
// import { Router } from 'meteor/iron:router';
// import { _ } from 'meteor/underscore';
// import { moment } from 'meteor/momentjs:moment';

import Films from '../../models/films';
import Screenings from '../../models/screenings';
import './ambassador.html';
import '../components/ambassadorFormFields.js';

Template.ambassador.helpers({
  hasPendingScreenings() {
    return Screenings.find({ status: 'Pendente'}).count() > 0;
  },
  screenings() {
    return Screenings.find(
      { user_id: Meteor.userId() },
      { sort: { created_at: -1 } },
    );
  },
  disseminate() {
    return Films.disseminate();
  },
  session_status_icon() {
    // Rascunho
    if ((this.status === 'Rascunho')
    || (this.status === 'Inválida')
    || (this.status === 'Agendada')
    || (this.status === 'Confirmada')) {
      return 'edit';
    }

    if (this.status === 'Pendente') {
      return 'report-pending';
    }

    // Completo
    if (this.status === 'Concluída') {
      return 'complete';
    }

    // Falta relatório
    return 'calendar';
  },
  in_future() {
    // console.log(this.status);
    return ((this.status === 'Rascunho')
    || (this.status === 'Inválida')
    || (this.status === 'Agendada')
    || (this.status === 'Confirmada'));
  },
  is_report_pending() {
    return this.status === 'Pendente';
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
