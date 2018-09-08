import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import './contact.html';

function contactMessageError(message, reason) {
  let alert;

  if (reason) {
    alert = message;
  } else {
    alert = message;
  }
  $('.form-errors').append(alert);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}

Template.contact.events({
  'submit form#contact-form'(event) {
    event.preventDefault();

    const name = event.target.name.value;
    const email = event.target.email.value;
    const message = event.target.message.value;

    const pidgeon = {
      to: 'contato@taturanamobi.com.br',
      from: 'suporte@taturanamobi.com.br',
      subject: 'Contato Site',
      name,
      email,
      message,
    };

    const mailTemplate = 'contact.html';

    Meteor.call('sendEmail', pidgeon, mailTemplate, (err) => {
      if (err) {
        contactMessageError('Houve algum erro, tente enviar novamente!', err.reason);
      } else {
        contactMessageError('Sua mensagem foi enviada com sucesso!');
      }
    });
  },
});
