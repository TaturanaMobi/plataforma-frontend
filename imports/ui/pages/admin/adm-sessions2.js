/* global document, window, navigator */
import { Meteor } from 'meteor/meteor';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';

import Films from '../../../models/films.js';
import Screenings from '../../../models/screenings.js';

Template.admSessions2.helpers({
  settings() {
    // const d = Films.find({});
    // console.log(d);
    // const screenings = Screenings.find({});
    // if (d !== null) {
    //   d.forEach((f) => {
    //     if (f !== null) {
    //       // const sNotDuplicated = [];
    //       _(screenings).each((s, i) => {
    //         s.film_title = f.title;
    //         s.film_slug = f.slug;
    //         s.user = Meteor.users.findOne(s.user_id);
    //         screenings[i] = s;
    //       });
    //     }
    //   });
    // }
    // const s = screenings;
    // console.log(s);
    const instance = Template.instance();
    return {
      collection: instance.data,
      // filters: ['filterTeamMember'],
      rowsPerPage: 10,
      showFilter: false,
      showRowCount: true,
      rowClass: (item) => {
        if (item.draft) {
          return 'is-draft';
        }

        const today = new Date();
        if (
          today.getTime() > item.date.getTime() &&
          item.report_description === undefined
        ) {
          return 'is-pending';
        }
        return '';
        //  || screening.draft == 'admin-draft');
      },
      fields: [
        { key: 'infos', label: 'Informações', tmpl: Template.infoCellTmpl, headerClass: 'col-md-1' },
        { key: 'film', label: 'Filme', tmpl: Template.filmCellTmpl, headerClass: 'col-md-2' },
        { key: 'date', label: 'Data de exibição', tmpl: Template.dateCellTmpl, headerClass: 'col-md-1' },
        { key: 'place_name', label: 'Local de exibição', tmpl: Template.screeningCellTmpl, headerClass: 'col-md-2' },
        // 'activity_theme',
        {
          key: 'ambassador',
          label: 'Embaixador',
          tmpl: Template.embaixadorCellTmpl,
          headerClass: 'col-md-2',
          // fn: (value, object) => console.log(object),
        },
        // {
        //   key: 'email',
        //   hidden: true,
        //   fn: (value, object) => object.user.emails[0].address,
        // },
        { key: 'quorum', label: 'Público', tmpl: Template.quorumCellTmpl },
        { key: 'city', label: 'Cidade', headerClass: 'col-md-1' },
        'uf',
        // 's_country', 'street', 'number', 'complement', 'zone', 'cep',
        //  'author_1', 'author_2', 'author_3',
        { label: 'Data criação', key: 'created_at', sortOrder: 0, sortDirection: 'descending', tmpl: Template.createdAtCellTmpl},
        { label: 'Ações', key: 'actions', tmpl: Template.actionsCellTmpl, headerClass: 'col-md-2' },
      ],
    };
  },

  ambassador_options(films) {
    let ambassadorsIds = [];

    _.each(films, (film) => {
      _.each(film.screening, (screening) => {
        if (screening.user_id) {
          ambassadorsIds.push(screening.user_id);
        }
      });
    });

    ambassadorsIds = _.uniq(ambassadorsIds);
    const ambassadors = Meteor.users.find({
      _id: {
        $in: ambassadorsIds,
      },
    }, {
      _id: 1,
      'profile.name': 1,
      sort: { 'profile.name': 1 },
    }).fetch();

    return _.uniq(ambassadors);
  },

  states_options() {
    return States.find({ has_screenings: true }).fetch();
  },

  cities_options() {
    return Cities.find({ has_screenings: true }).fetch();

    // const filter = { has_screenings: true };
    // const state = Session.get('state');
    // if (state) {
    //   filter.state = state;
    // }
    // return Cities.find(filter, { sort: { name: 1, state: 1 } }).fetch();
  },
});

Template.admSessions.events({
  'change .list-sessions'(event) {
    const list = $(event.currentTarget).val();
    Session.set('list', list);
  },
  'change #city-selector'(event) {
    const city = $(event.currentTarget).val();
    Session.set('city', city);
  },
  'change #st-selector'(event) {
    const state = $(event.currentTarget).val();
    Session.set('state', state);
  },
  'change #film-selector'(event) {
    const title = $(event.currentTarget).val();
    Session.set('title', title);
  },
  'change #ambassador-selector'(event) {
    const ambassador = $(event.currentTarget).val();
    Session.set('ambassador', ambassador);
  },
  'change #team-selector'(event) {
    Session.set('team', event.currentTarget.checked);
  },
  'change #public-event'(event) {
    Session.set('public', event.currentTarget.checked);
  },
  'change #comment'(event) {
    Session.set('comment', event.currentTarget.checked);
  },
  'change #pendingReport'(event) {
    Session.set('report', event.currentTarget.checked);
  },
  'change #creation-date'(event) {
    Session.set('creation_date', event.currentTarget.checked);
  },
  'click .btn-datepicker'(event) {
    const month = $(event.currentTarget).data('month');
    Session.set('month', month);
  },
  'click .btn-set-draft'() {
    const id = this._id;
    const user_id = this.user_id;
    const film_and_screening = Films.return_film_and_screening(id);
    const film = film_and_screening.film;
    const screening = film_and_screening.screening;

    Meteor.call('setScreeningDraftStatus', id, 'admin-draft');

    const emailTemplate = 'admin-draft.html';
    const data = {
      to: getEmail(user_id),
      from: 'suporte@taturanamobi.com.br',
      subject: `Edite sua sessão do ${film.title} / ${moment(screening.date).format('L')})`,
      name: getUserProfile(user_id).name,
      movie: film.title,
      absoluteurl: Meteor.absoluteUrl(),
    };
    Meteor.call('sendEmail', data, emailTemplate);
  },
  'click .btn-unset-draft'(event) {
    const id = $(event.currentTarget).data('session-id');
    Meteor.call('setScreeningDraftStatus', id, false);
  },
  'click .csv-export'() {
    const screenings = this.screenings;
    const csv = Papa.unparse(screenings.map((scr) => {
      const d = moment(scr.date);
      const created = moment(scr.created_at);
      const contact = getUserProfile(scr.user_id);

      return {
        'id do embaixador': scr.user_id,
        'nome de contato': contact ? contact.name : '',
        'email de contato': getEmail(scr.user_id),
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

    const filename = `${this.title.replace(' ', '_')}.csv`;
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
  },
});
