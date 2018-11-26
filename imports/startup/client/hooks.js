import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';
// import Users from './../../models/users';

// AutoForm.setDefaultTemplate('plain');

AutoForm.hooks({
  'new-screening-form': {
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Sessão salva com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },

    // Called when any submit operation fails
    // onError: (formType, error) => {
    //   FlashMessages.sendError('Preencha todas as informações.');
    //   console.log(error, formType);
    // },
  },
  'new-user-form': {
    // // Called when any submit operation succeeds
    onSubmit(insertDoc, updateDoc, currentDoc) {
      //   if (customHandler(insertDoc)) {
      //   } else {
      //     this.done(new Error("Submission failed"));
      //   }
      //   return false;
      // }
      this.event.preventDefault();
      insertDoc.profile.roles = ['ambassador'];
      // console.log(insertDoc, updateDoc, currentDoc);
      const self = this;
      Accounts.createUser(insertDoc, (err) => {
        console.log(err, insertDoc);
        Router.go('ambassador');

        // Envia email para o ambassador cadastrado
        const ambassadorTemplate = 'new-ambassador.html';

        const ambassadorEmail = {
          to: insertDoc.email,
          from: 'suporte@taturanamobi.com.br',
          subject: 'Bem Vind@ à Taturana!',
          absoluteurl: Meteor.absoluteUrl(),
          name: insertDoc.profile.name,
        };
        Meteor.call('sendEmail', ambassadorEmail, ambassadorTemplate);
        // Fim do envio de email
        self.done();
      });
    },

    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Usuário criado com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },

    // Called when any submit operation fails
    // onError: (formType, error) => {
    //   FlashMessages.sendError('Preencha todas as informações.');
    //   console.log(error, formType);
    // },
  },
  'edit-film-form': {
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Filme salvo com sucesso!');
      return result;
    },

    // Called when any submit operation fails
    // onError: (formType, error) => {
    //   FlashMessages.sendError('Preencha todas as informações corretamente.');
    //   console.log(error, formType);
    // },
  },

});