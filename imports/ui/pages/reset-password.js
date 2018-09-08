import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';

import './reset-password.html';

Template.resetPassword.onRendered(() => {
  $('.reset-password').validator();
});

Template.resetPassword.events({
  'submit .reset-password'(event) {
    event.preventDefault();

    const resetPasswordForm = $(event.currentTarget);
    const error = $('.form-errors');
    const password = resetPasswordForm.find('.password').val();
    const passwordConfirm = resetPasswordForm.find('.password-validation').val();

    if (password !== passwordConfirm) {
      error.html('As senhas não conferem');
      return;
    }

    Accounts.resetPassword(Router.current().params.token, password, (err) => {
      if (err) {
        error.html('Ocorreu um erro. Tente novamente em alguns momentos');
      } else {
        error.html('Sua senha foi alterada.');
      }
    });
  },
});
