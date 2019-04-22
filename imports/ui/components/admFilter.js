
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import Papa from 'papaparse';
import getSelectOptions from '../../models/schemas/getSelectOptions';

import Films from '../../models/films.js';
//import { SCREENING_STATUS } from '../../../models/schemas/index.js';
import { SCREENING_STATUS, FILM_CATEGORIES, FILM_SUBCATEGORIES } from '../../models/schemas/index.js';
import Screenings from '../../models/screenings.js';
//import { Cities, States } from '../../../models/states_and_cities';

import './admFilter.html';
Template.admFilter.onCreated(function () {
  const r = Router.current();
  // console.log(Template.instance().data);
  console.log(r.params);
  this.state = new ReactiveDict();
  this.state.setDefault('screening-date-selector', r.params.query.screeningDate);
  this.state.setDefault('film-selector', r.params.query.filmId);
  this.state.setDefault('user-selector', r.params.query.userId );
  this.state.setDefault('state-selector', r.params.query.state );
  this.state.setDefault('city-selector', r.params.query.city );
  this.state.setDefault('status-selector', r.params.query.status );

  this.state.setDefault('team-member-selector', r.params.query.teamMember );
  this.state.setDefault('public-event-selector', r.params.query.publicEvent );
  this.state.setDefault('has-comments-selector', r.params.query.hasComments );
  this.state.setDefault('missing-reports-selector', r.params.query.missingReports);

  this.state.setDefault('filterData', Template.instance().data || []);

  this.buildQuerySession = (formValues) => {
    const {
      screeningDate,
      filmId,
      userId,
      state,
      status,
      city,
      teamMember,
      publicEvent,
      hasComments,
      missingReports,
    } = formValues;
    console.log(formValues);
    const o = {};

    this.state.set('screening-date-selector', screeningDate);
    this.state.set('film-selector', filmId);
    this.state.set('user-selector', userId );
    this.state.set('state-selector', state );
    this.state.set('city-selector', city );
    this.state.set('status-selector', status );

    this.state.set('team-member-selector', teamMember );
    this.state.set('public-event-selector', publicEvent );
    this.state.set('has-comments-selector', hasComments );
    this.state.set('missing-reports-selector', missingReports);

    if ((screeningDate !== undefined) && (screeningDate !== '')) {
      const d = screeningDate.split('-');
      const d1 = new Date();
      d1.setTime(d[0]);
      const d2 = new Date();
      d2.setTime(d[1]);
      o.date = {
        $gte: d1,
        $lt: d2,
      };
    }
    if ((filmId !== undefined) && (filmId !== '')) {
      o.filmId = filmId;
    }
    if ((userId !== undefined) && (userId !== '')) {
      o.userId = userId;
    }
    if ((state !== undefined) && (state !== '')) {
      o.uf = state;
    }
    if ((status !== undefined) && (status !== '')) {
      o.status = status;
    }
    if ((city !== undefined) && (city !== '')) {
      o.city = city;
    }
    if (teamMember) {
      o.team_member = { $eq: true };
    }
    if (publicEvent) {
      o.public_event = { $eq: true };
    }
    if (hasComments) {
      o.comments = {"$exists" : true, "$ne" : "Sem comentários."};
    }
    if (missingReports) {
      o.status = 'Pendente';
    }
    console.log(o);
    return o;
  };

  this.buildQueryUser = (formValues) => {
    const {
      screeningDate,
      filmId,
      userId,
      state,
      status,
      city,
      teamMember,
      publicEvent,
      hasComments,
      missingReports,
    } = formValues;
    console.log(formValues);
    const o = {};

    this.state.set('screening-date-selector', screeningDate);
    this.state.set('film-selector', filmId);
    this.state.set('user-selector', userId );
    this.state.set('state-selector', state );
    this.state.set('city-selector', city );
    this.state.set('status-selector', status );

    this.state.set('team-member-selector', teamMember );
    this.state.set('public-event-selector', publicEvent );
    this.state.set('has-comments-selector', hasComments );
    this.state.set('missing-reports-selector', missingReports);

    if ((screeningDate !== undefined) && (screeningDate !== '')) {
      const d = screeningDate.split('-');
      const d1 = new Date();
      d1.setTime(d[0]);
      const d2 = new Date();
      d2.setTime(d[1]);
      o.date = {
        $gte: d1,
        $lt: d2,
      };
    }
    if ((filmId !== undefined) && (filmId !== '')) {
      o.filmId = filmId;
    }
    if ((userId !== undefined) && (userId !== '')) {
      o.userId = userId;
    }
    if ((state !== undefined) && (state !== '')) {
      o.uf = state;
    }
    if ((status !== undefined) && (status !== '')) {
      o.status = status;
    }
    if ((city !== undefined) && (city !== '')) {
      o.city = city;
    }
    if (teamMember) {
      o.team_member = { $eq: true };
    }
    if (publicEvent) {
      o.public_event = { $eq: true };
    }
    if (hasComments) {
      o.comments = {"$exists" : true, "$ne" : "Sem comentários."};
    }
    if (missingReports) {
      o.status = 'Pendente';
    }
    console.log(o);
    return o;
  };

  this.isUserFilter = () => Template.instance().data.isUserFilter;

  this.updateResults = (formValues) => {
    let q, s;
    if (this.isUserFilter()) {
      q = this.buildQueryUser(formValues);
      s = Meteor.users.find(q).fetch();
    } else {
      q = this.buildQuerySession(formValues);
      s = Screenings.find(q).fetch();
    }

    console.log(q);
    this.state.set('filterData', s);
  };

  this.autorun(() => {
    const screeningDate = this.state.get('screening-date-selector');
    const filmId = this.state.get('film-selector');
    const userId = this.state.get('user-selector');
    const state = this.state.get('state-selector');
    const city = this.state.get('city-selector');
    const status = this.state.get('status-selector');

    const teamMember = this.state.get('team-member-selector');
    const publicEvent = this.state.get('public-event-selector');
    const hasComments = this.state.get('has-comments-selector');
    const missingReports = this.state.get('missing-reports-selector');
    this.updateResults({
      screeningDate,
      filmId,
      userId,
      state,
      status,
      city,
      teamMember,
      publicEvent,
      hasComments,
      missingReports,
    });
  });
});

Template.admFilter.helpers({
  settingsUser() {
    return {
      // collection: instance.data,
      collection: Template.instance().state.get('filterData'),
      // filters: ['filterTeamMember'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      fields: [
        { label: 'Ações', key: 'actions', tmpl: Template.actionsAmbassadorCellTmpl2 },
        // 'emails.0.address',
        'profile.name',
        'profile.cell_phone',
        'profile.city',
        'profile.uf',
        'profile.institution',
        'profile.category',
        'profile.subcategory',
        {
          label: 'Data criação', key: 'createdAt', sortOrder: 0, sortDirection: 'descending', tmpl: Template.createdAtCellTmpl2,
        },
      ],
      //   'status',
      //   { label: 'Press Kit', key: 'press_kit_path', tmpl: Template.pressKitCellTmpl },
      //   // 'slug',
      //   'genre',
      //   { label: 'Poster', key: 'poster_path', tmpl: Template.posterCellTmpl },
      //   { label: 'Poster Home', key: 'poster_home_path', tmpl: Template.posterHomeCellTmpl },
      // ],
    };
  },
  settingsSession() {
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
  month_options() {
    const months = [];
    const screenings = Template.instance().state.get('filterData');

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
    const t = Template.instance();
    const states = [];
    const screenings = Template.instance().state.get('filterData');


    if (t.isUserFilter()) {
      _.each(screenings, function (screening) {
        if (screening.profile.uf) {
          states.push(screening.profile.uf);
        }
      });
    } else {
      _.each(screenings, function (screening) {
        if (screening.uf) {
          states.push(screening.uf);
        }
      });
    }
    return getSelectOptions(_.uniq(states).sort());
  },

  cities_options() {
    const t = Template.instance();
    const cities = [];
    const screenings = t.state.get('filterData');
    if (t.isUserFilter()) {
      _.each(screenings, function (screening) {
        if (screening.profile.city) {
          cities.push(screening.profile.city);
        }
      });
    } else {
      _.each(screenings, function (screening) {
        if (screening.city) {
          cities.push(screening.city);
        }
      });
    }

    return getSelectOptions(_.uniq(cities).sort());
  },
  status_options() {
    return getSelectOptions(SCREENING_STATUS);
  },
  categories_options() {
    return getSelectOptions(FILM_CATEGORIES);
  },
  subcategories_options() {
    return getSelectOptions(FILM_SUBCATEGORIES);
  },
});

Template.admFilter.events({
  'click .btn.btn-primary.btn-default[value=filter]'(event, instance) {
    event.preventDefault();

    instance.updateResults(AutoForm.getFormValues('adm-filter-form').insertDoc);
  },
  'click .btn.btn-default[value=reset]'(event, instance) {
    event.preventDefault();

    AutoForm.resetForm('adm-filter-form');
    instance.updateResults({});
  },
  'click .btn.btn-primary.btn-default[value=export]'(event, instance) {
    event.preventDefault();

    const screenings = instance.state.get('filterData');
    downloadCsv(screenings);
  },
});

const downloadCsvUser = (users) => {
  const data = users.map((u) => {
    const d = moment(u.createdAt);

    return {
      'data de criação': d.format('D/M/Y'),
      'hora da criação': d.format('HH:mm'),
      nome: u.profile.name,
      email: u.emails[0].address,
      'telefone fixo': u.profile.phone,
      'telefone celular': u.profile.cell_phone,
      instituição: u.profile.institution,
      área: u.profile.category,
      temática: u.profile.subcategory,
      uf: u.profile.uf,
      city: u.profile.city,
      id: u._id,
    };
  });
  const csv = Papa.unparse(data);
  window.open(encodeURI(`data:text/csv;charset=utf-8,${csv}`));
};

const downloadCsvScreening = (screenings) => {
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
