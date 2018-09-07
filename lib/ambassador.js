import { Meteor, FlashMessages } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
  Template.ambassadorFormFields.helpers({
    user_email() {
      return (Meteor.user()) ? Meteor.user().emails[0].address : '';
    },
    showPassword() {
      return Router.current().route.getName() === 'register';
    },

  });

  Template.register.events({
    'submit .new-ambassador'(event) {
      event.preventDefault();

      const name = event.target.name.value;
      const email = event.target.email.value;
      const password = event.target.password.value;
      const cell_phone = event.target.cell_phone.value;
      const phone = event.target.phone.value;
      const country = event.target.country.value;
      const city = event.target.city.value;
      const uf = event.target.uf.value;
      const institution = event.target.institution.value;
      const category = event.target.category.value;
      const subcategory = event.target.subcategory.value;

      Accounts.createUser({
        email,
        password,
        profile: {
          roles: ['ambassador'],
          name,
          cell_phone,
          phone,
          country,
          city,
          uf,
          institution,
          category,
          subcategory,
        },
      }, () => {
        Router.go('ambassador');

        // Envia email para o ambassador cadastrado
        const ambassadorTemplate = 'new-ambassador.html';

        const ambassadorEmail = {
          to: email,
          from: 'suporte@taturanamobi.com.br',
          subject: 'Bem Vind@ à Taturana!',
          absoluteurl: Meteor.absoluteUrl(),
          name,
        };
        Meteor.call('sendEmail', ambassadorEmail, ambassadorTemplate);
        // Fim do envio de email
      });
    },
  });

  Template.ambassadorEdit.events({
    'submit .ambassador-edit'(event) {
      event.preventDefault();

      const avatar_path = (event.target.avatar_path === undefined) ? Session.get('avatar_path') : event.target.avatar_path.value;
      const email = event.target.email.value;
      const profile = {
        name: event.target.name.value,
        avatar_path,
        cell_phone: event.target.cell_phone.value,
        phone: event.target.phone.value,
        country: event.target.country.value,
        city: event.target.city.value,
        uf: event.target.uf.value,
        institution: event.target.institution.value,
        category: event.target.category.value,
        subcategory: event.target.subcategory.value,
      };

      Meteor.call('updateUser', profile, email);
      FlashMessages.sendSuccess('Atualização efetuada com sucesso!');
      Router.go('ambassador');
    },
    'click .destroy'() {
      Meteor.call('removeScreening', this._id);
    },
  });
  Template.ambassadorEdit.helpers({
    avatarData() {
      return { file_type: 'avatar_path' };
    },
    amount_film_screenings() {
      const scrs = Films.screenings_by_user_id(Meteor.userId());
      const today = new Date();
      let pastScr = 0;
      let people = 0;

      _.each(scrs, (scr) => {
        if (scr.date.getTime() < today.getTime()) {
          if (scr.real_quorum) {
            people = parseInt(scr.real_quorum, 10) + people;
          }
          pastScr += 1;
        }
      });

      return { pastScr, people };
    },
    amount_films() {
      return Films.by_user_id(Meteor.userId()).length;
    },
  });
}

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
