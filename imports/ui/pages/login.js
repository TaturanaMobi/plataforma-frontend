import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import './login.html';

function messageError(reason) {
  const message = 'Usuário ou senha incorretos';
  $('.form-errors').html(message);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
  console.log(reason);
}

Template.login.onRendered(() => {
  $('.login-ambassador').validator();
});

Template.login.events({
  'submit .login-ambassador'(event) {
    event.preventDefault();

    const email = event.target.email.value;
    const password = event.target.password.value;
    Meteor.loginWithPassword(
      email,
      password,
      (err) => {
        if (err) {
          event.target.password.value = '';
          messageError(err);
        } else {
          event.target.reset();
          if (Meteor.user().profile.roles[0] === 'admin') {
            Router.go('/');
          } else {
            Router.go('ambassador');
          }
        }
      },
    );
  },
});
