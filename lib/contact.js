import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

if (Meteor.isClient) {
  Template.contact.events({
    'submit form#contact-form': function (event) {
      event.preventDefault();

      const name = event.target.name.value;
      const email = event.target.email.value;
      const message = event.target.message.value;

      pidgeon = {
        to: 'contato@taturanamobi.com.br',
        from: '',
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
}

function contactMessageError(message, reason) {
  if (reason) {
    alert = message;
  } else {
    alert = message;
  }
  $('.form-errors').append(alert);
  $('html, body').animate({ scrollTop: 0 }, 'fast');
}
