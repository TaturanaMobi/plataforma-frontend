import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';

AutoForm.hooks({
  'new-screening-form': {
    before: {
      insert: (doc) => {
        doc.status = 'Agendada';
        if (doc.draft) {
          doc.status = 'Rascunho';
        }

        if (doc.saveAddress) {
          const address = {
            _id: new Meteor.Collection.ObjectID().valueOf(),
            place_name: doc.place_name,
            cep: doc.cep,
            street: doc.street,
            number: doc.number,
            complement: doc.complement,
            zone: doc.zone,
            city: doc.city,
            uf: doc.uf,
            s_country: doc.s_country,
          };

          delete doc.saveAddress;

          Meteor.call('addAddress', Meteor.userId(), address);
        }

        return doc;
      },
    },
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Sessão salva com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },

    // Called when any submit operation fails
    onError: (formType, error) => {
      const e = error.toString();
      FlashMessages.sendError(`Preencha todas as informações. ${e.substring(6)}`);
      console.log(error, formType);
    },
  },

  'new-user-form': {
    // // Called when any submit operation succeeds
    onSubmit(insertDoc) {
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
    onError: (formType, error) => {
      const e = error.toString();
      FlashMessages.sendError(`Preencha todas as informações. ${e.substring(6)}`);
      console.log(error, formType);
    },
  },

  'edit-film-form': {
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Filme salvo com sucesso!');
      setTimeout(() => {
        Router.go('/adm/films');
      }, 2000);
      return result;
    },
  },

  'update-screening-form': {
    before: {
      update: (doc) => {
        doc.$set.status = 'Agendada';
        if (doc.$set.draft) {
          doc.$set.status = 'Rascunho';
        }

        if (doc.$set.saveAddress) {
          const address = {
            _id: new Meteor.Collection.ObjectID().valueOf(),
            place_name: doc.$set.place_name,
            cep: doc.$set.cep,
            street: doc.$set.street,
            number: doc.$set.number,
            complement: doc.$set.complement,
            zone: doc.$set.zone,
            city: doc.$set.city,
            uf: doc.$set.uf,
            s_country: doc.$set.s_country,
          };

          delete doc.$set.saveAddress;

          Meteor.call('addAddress', Meteor.userId(), address);
        }
        return doc;
      },
    },
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Sessão atualizada com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },
    onError: (formType, error) => {
      const e = error.toString();
      FlashMessages.sendError(`Preencha todas as informações. ${e.substring(6)}`);
      console.log(error, formType);
    },
  },

  'edit-report-form': {
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Relatório salvo com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },
    onError: (formType, error) => {
      FlashMessages.sendError('Preencha todas as informações.');
      console.log(error, formType);
    },
  },

  'edit-user-form': {
    // Called when any submit operation succeeds
    onSuccess: (formType, result) => {
      FlashMessages.sendSuccess('Usuário criado com sucesso!');
      setTimeout(() => {
        Router.go('/ambassador');
      }, 2000);
      return result;
    },

    // Called when any submit operation fails
    onError: (formType, error) => {
      const e = error.toString();
      FlashMessages.sendError(`Preencha todas as informações. ${e.substring(6)}`);
      console.log(error, formType);
    },
  },
});
