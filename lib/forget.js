import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Accounts } from 'meteor/accounts-base';

if (Meteor.isClient) {
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
}
function errorMessage(err) {
  if (err.reason === 'User not found') {
    message('Usuário inexistente');
  }
}
function message(message) {
  $('.form-errors').html(message);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}
