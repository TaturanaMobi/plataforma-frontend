import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Accounts } from 'meteor/accounts-base';
import { Router } from 'meteor/iron:router';
import Papa from 'papaparse';
import Screenings from '../../models/screenings.js';

AutoForm.hooks({
  'filter-screening-form': {
    onSubmit(insertDoc) {
      this.event.preventDefault();
      // console.log(insertDoc, this.event, this.event.originalEvent.explicitOriginalTarget.value);
      console.log(Template.instance());
      const buttonSrc = this.event.originalEvent.explicitOriginalTarget.value;

      if (buttonSrc === 'reset') {
        // console.log('reseting not working')
        AutoForm.resetForm(this.event.currentTarget.id);
        // AutoForm.resetForm('filter-screening-form');
        // this.resetForm();
      } else if (buttonSrc === 'export') {
        const screenings = Screenings.find({});
        const csv = Papa.unparse(screenings.map((scr) => {
          const d = moment(scr.date);
          const created = moment(scr.created_at);
          const contact = Meteor.users.findOne(scr.user_id);

          return {
            'id do embaixador': scr.user_id,
            'nome de contato': contact ? contact.name : '',
            'email de contato': contact.emails[0].address,
            rascunho: (scr.draft) ? 'sim' : 'não',
            'evento público': (scr.public_event) ? 'sim' : 'não',
            'presença de equipe': (scr.team_member) ? 'sim' : 'não',
            'data do evento': d.format('D/M/Y'),
            'dia da semana': d.format('dddd'),
            'horário do evento': d.format('HH:mm'),
            'nome do local': scr.place_name,
            cep: scr.cep,
            cidade: scr.city,
            estado: scr.uf,
            bairro: scr.zone,
            país: scr.s_country,
            rua: scr.street,
            número: scr.number,
            complemento: scr.complement,
            atividade: scr.activity,
            'tema da atividade': scr.activity_theme,
            comentários: scr.comments,
            'expectativa de publico': scr.quorum_expectation,
            'publico real': scr.real_quorum,
            'descrição de report': scr.report_description,
            'data de criação': created.format('D/M/Y'),
            'horário de criação': created.format('HH:mm'),
            id: scr._id,
          };
        }));

        const filename = `${new Date()}-sessoes-com-filro.csv`;
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, filename);
        } else {
          const link = document.createElement('a');
          if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // else, show the file as before this changes, but name is "download"
            window.open(encodeURI(`data:text/csv;charset=utf-8 ${csv}`));
          }
        }
      } else if (buttonSrc === 'filter') {

      }
      this.done();
    }
  },
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

  'edit-screening-form': {
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
