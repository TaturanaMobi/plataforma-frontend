/* global document, window, navigator */
// import { Meteor } from 'meteor/meteor';
// import { moment } from 'meteor/momentjs:moment';
// import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import Papa from 'papaparse';
import getSelectOptions from '../../../models/schemas/getSelectOptions';

// import Films from '../../../models/films.js';
import { SCREENING_STATUS } from '../../../models/schemas/index.js';
import Films from '../../../models/films.js';
import Screenings from '../../../models/screenings.js';
import { Cities, States } from '../../../models/states_and_cities';

Template.admSessions2.helpers({
  filter_form() {
    console.log( {
      screeningDate: this.state.get('screening-date-selector'),
      filmId: this.state.get('film-selector'),
      userId: this.state.get('user-selector'),
      state: this.state.get('state-selector'),
      city: this.state.get('city-selector'),
      status: this.state.get('status-selector'),

      teamMember: this.state.get('team-member-selector'),
      publicEvent: this.state.get('public-event-selector'),
      hasComments: this.state.get('has-comments-selector'),
      missingReports: this.state.get('missing-reports-selector'),
    });
    return {
      missingReports: true,
    };
  },
  settings() {
    return {
      // collection: Template.instance().data,
      collection: Template.instance().state.get('filterData'),
      // filters: ['myFilter'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      rowClass: (item) => {
        if (item.draft) {
          return 'is-draft';
        }

        const today = new Date();
        if (today.getTime() > item.date.getTime() && item.report_description === undefined) {
          return 'is-pending';
        }
        return '';
        //  || screening.draft == 'admin-draft');
      },
      fields: [
        {
          label: 'Ações', key: 'actions', tmpl: Template.actionsCellTmpl, headerClass: 'col-md-2',
        },
        {
          key: 'infos', label: 'Informações', tmpl: Template.infoCellTmpl, headerClass: 'col-md-1',
        },
        {
          key: 'filmId',
          label: 'Filme',
          headerClass: 'col-md-2',
          fn: value => Films.find({ _id: value }).fetch()[0].title,
          // tmpl: Template.filmCellTmpl
        },
        {
          key: 'date', label: 'Data de exibição', tmpl: Template.dateCellTmpl, headerClass: 'col-md-1',
        },
        {
          key: 'place_name', label: 'Local de exibição', tmpl: Template.screeningCellTmpl, headerClass: 'col-md-2',
        },
        {
          key: 'user_id',
          label: 'Embaixador',
          headerClass: 'col-md-2',
          fn: value => {
            const u = Meteor.users.find({ _id: value }).fetch()[0];
            return u.profile.name;
          },
          //tmpl: Template.embaixadorCellTmpl
        },
        {
          key: 'ambassador',
          label: 'Ambassador e-mail',
          fn: (value, object) => {
            // console.log(value);
            const u = Meteor.users.find({ _id: object.user_id }).fetch()[0];
            return u.emails[0].address;
          },
        },
        { key: 'quorum', label: 'Público', tmpl: Template.quorumCellTmpl },
        { key: 'city', label: 'Cidade', headerClass: 'col-md-1' },
        'uf',
        'status',
        // 's_country', 'street', 'number', 'complement', 'zone', 'cep',
        //  'author_1', 'author_2', 'author_3',
        {
          label: 'Data criação', key: 'created_at', sortOrder: 0, sortDirection: 'descending', tmpl: Template.createdAtCellTmpl,
        },
      ],
    };
  },
});

Template.admSessions2.events({
  'click .btn.btn-primary.btn-default[value=filter]'(event, instance) {
    event.preventDefault();

    instance.updateResults(AutoForm.getFormValues('filter-screening-form').insertDoc);
  },
  'click .btn.btn-default[value=reset]'(event, instance) {
    event.preventDefault();

    AutoForm.resetForm('filter-screening-form');
    instance.updateResults({});
  },
  'click .btn.btn-primary.btn-default[value=export]'(event, instance) {
    event.preventDefault();

    const screenings = instance.state.get('filterData');
    downloadCsv(screenings);
  },
//   'click .btn-set-draft'() {
//     const id = this._id;
//     const user_id = this.user_id;
//     const film_and_screening = Films.return_film_and_screening(id);
//     const film = film_and_screening.film;
//     const screening = film_and_screening.screening;

//     Meteor.call('setScreeningDraftStatus', id, 'admin-draft');

//     const emailTemplate = 'admin-draft.html';
//     const data = {
//       to: getEmail(user_id),
//       from: 'suporte@taturanamobi.com.br',
//       subject: `Edite sua sessão do ${film.title} / ${moment(screening.date).format('L')})`,
//       name: getUserProfile(user_id).name,
//       movie: film.title,
//       absoluteurl: Meteor.absoluteUrl(),
//     };
//     Meteor.call('sendEmail', data, emailTemplate);
//   },
//   'click .btn-unset-draft'(event) {
//     const id = $(event.currentTarget).data('session-id');
//     Meteor.call('setScreeningDraftStatus', id, false);
//   },
//   'click .csv-export'() {
//   },
 });

const downloadCsv = (screenings) => {
  const csv = Papa.unparse(screenings.map((scr) => {
  const d = moment(scr.date);
  const created = moment(scr.created_at);
  const contact = Meteor.users.findOne(scr.user_id);
  const f = Films.findOne(scr.filmId);

    return {
      'id do embaixador': scr.user_id,
      'nome de contato': contact ? contact.profile.name : '',
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
      status: scr.status,
      film: f.title
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
}
