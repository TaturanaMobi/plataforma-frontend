import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Accounts } from 'meteor/accounts-base';

import './forget.html';

function message(m) {
  $('.form-errors').html(m);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}

function errorMessage(err) {
  if (err.reason === 'User not found') {
    message('Usuário inexistente');
  }
}

Template.forget.onRendered(() => {
  $('.forget-ambassador').validator();
});

Template.forget.events({
  'submit .forget-ambassador'(event) {
    event.preventDefault();

    const email = event.target.email.value;
    Accounts.forgotPassword({ email }, (err) => {
      if (err) {
        errorMessage(err);
      } else {
        message('Um e-mail foi enviado');
      }
    });
  },
});
