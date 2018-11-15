import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';

import './register.html';

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
