/* global document, window, navigator */
// import { Meteor } from 'meteor/meteor';
// import { moment } from 'meteor/momentjs:moment';
// import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import getSelectOptions from '../../../models/schemas/getSelectOptions';

// import Films from '../../../models/films.js';
import Screenings from '../../../models/screenings.js';
import { Cities, States } from '../../../models/states_and_cities';

Template.admSessions2.onCreated(function () {
  const r = Router.current();
  // console.log(Template.instance().data);
  this.state = new ReactiveDict();
  this.state.setDefault('film-selector', r.params.query.filmSelector);
  this.state.setDefault('state-selector', r.params.query.stateSelector);
  this.state.setDefault('city-selector', r.params.query.citySelector);
  this.state.setDefault('month-selector', r.params.query.monthSelector);
  // this.state.setDefault('screenings', Template.instance().data);

  this.buildQuery = (filmId, state, city, month) => {
    const o = {};
    if ((filmId !== undefined) && (filmId !== '')) {
      o.filmId = filmId;
    }
    if ((city !== undefined) && (city !== '')) {
      o.city = city;
    }
    if ((state !== undefined) && (state !== '')) {
      o.uf = state;
    }
    if ((month !== undefined) && (month !== '')) {
      const d = month.split('-');
      const d1 = new Date();
      d1.setTime(d[0]);
      const d2 = new Date();
      d2.setTime(d[1]);
      o.date = {
        $gte: d1,
        $lt: d2,
      };
    }
    // console.log(o);
    return o;
  };

  this.updateResults = (filmId, state, city, month) => {
    const q = this.buildQuery(filmId, state, city, month);
    // const s = Screenings.find({});
    const s = Template.instance().data.fetch();
    // console.log(s);
    this.data = [];
    this.state.set('screenings', s);
    // this.state.set('films', this.getFutureFilms());
  };

  this.setFilter = (n, v) => {
    this.state.set(n, v);
  };

  this.autorun(() => {
    const filmId = this.state.get('film-selector');
    const state = this.state.get('state-selector');
    const city = this.state.get('city-selector');
    const month = this.state.get('month-selector');

    this.updateResults(filmId, state, city, month);
  });
});

Template.admSessions2.helpers({
  settings() {
    return {
      collection: Template.instance().data,
      // collection: Template.instance().state.get('screenings'),
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
          key: 'film',
          label: 'Filme',
          headerClass: 'col-md-2',
          fn: value => value.title,
        },
        {
          key: 'date', label: 'Data de exibição', tmpl: Template.dateCellTmpl, headerClass: 'col-md-1',
        },
        {
          key: 'place_name', label: 'Local de exibição', tmpl: Template.screeningCellTmpl, headerClass: 'col-md-2',
        },
        {
          key: 'ambassador',
          label: 'Embaixador',
          headerClass: 'col-md-2',
          fn: value => value.profile.name,
        },
        {
          key: 'ambassador',
          label: 'Ambassador e-mail',
          // hidden: true,
          fn: (value, object) => {
            // console.log(value);
            return value.emails[0].address;
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
  month_options() {
    const months = [];
    const screenings = Template.instance().state.get('screenings');

    _.each(screenings, function (screening) {
      if (screening.date) {
        months.push(
          `${new Date(screening.date.getFullYear(), screening.date.getMonth(), 1).getTime()}-${new Date(screening.date.getFullYear(), screening.date.getMonth() + 1, 0).getTime()}`,
        );
      }
    });

    return _.uniq(months).sort().map((v) => {
      const d = new Date();
      d.setTime(v.split('-')[0]);
      return {
        label: `${new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(d)} ${d.getFullYear()}`,
        value: v,
      };
    });
  },

  states_options() {
    const states = [];
    const screenings = Template.instance().state.get('screenings');

    _.each(screenings, function (screening) {
      if (screening.uf) {
        states.push(screening.uf);
      }
    });

    return getSelectOptions(_.uniq(states).sort());
  },

  cities_options() {
    const cities = [];
    const screenings = Template.instance().state.get('screenings');

    _.each(screenings, function (screening) {
      if (screening.city) {
        cities.push(screening.city);
      }
    });

    return getSelectOptions(_.uniq(cities).sort());
  },
});

// Template.admSessions2.events({
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
// });
