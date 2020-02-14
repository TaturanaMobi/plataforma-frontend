import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { ReactiveDict } from 'meteor/reactive-dict';
import Papa from 'papaparse';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';

import getSelectOptions from '../../../models/schemas/getSelectOptions';
import { FILM_CATEGORIES, FILM_SUBCATEGORIES, STATES } from '../../../models/schemas/index.js';

// import Films from '../../../models/films.js';

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

Template.admAmbassadors.onCreated(function () {
  const r = Router.current();
  this.state = new ReactiveDict();

  this.state.setDefault('categories-selector', r.params.query.categories);
  this.state.setDefault('subcategories-selector', r.params.query.subcategories);
  this.state.setDefault('film-selector', r.params.query.filmId);
  this.state.setDefault('state-selector', r.params.query.state);
  this.state.setDefault('city-selector', r.params.query.city);

  this.state.setDefault('no-screenings-selector', r.params.query.noScreenings);
  this.state.setDefault('team-member-selector', r.params.query.teamMember);
  this.state.setDefault('missing-reports-selector', r.params.query.missingReports);

  this.state.setDefault('filterData', []);

  this.buildQueryUser = (formValues) => {
    const {
      categories,
      subcategories,
      filmId,
      state,
      city,
      noScreenings,
      teamMember,
      missingReports,
    } = formValues;
    console.log(formValues);
    const o = {};


    this.state.set('categories-selector', categories);
    this.state.set('subcategories-selector', subcategories);
    this.state.set('film-selector', filmId);
    this.state.set('state-selector', state);
    this.state.set('city-selector', city);

    this.state.set('no-screenings-selector', noScreenings);
    this.state.set('team-member-selector', teamMember);
    this.state.set('missing-reports-selector', missingReports);

    // if ((filmId !== undefined) && (filmId !== '')) {
    //   o.filmId = filmId;
    // }
    if ((categories !== undefined) && (categories !== '')) {
      o['profile.category'] = categories;
    }
    if ((subcategories !== undefined) && (subcategories !== '')) {
      o['profile.subcategory'] = subcategories;
    }
    if ((state !== undefined) && (state !== '')) {
      o['profile.uf'] = state;
    }
    if ((city !== undefined) && (city !== '')) {
      o['profile.city'] = city;
    }
    // if (teamMember) {
    //   o.team_member = { $eq: true };
    // }
    console.log(o);
    return o;
  };

  this.updateResults = (formValues) => {
    const q = this.buildQueryUser(formValues);
    const s = Meteor.users.find(q).fetch();

    this.state.set('filterData', s);
  };

  let firstRun = true;
  this.autorun(() => {
    if (!firstRun) {
      return;
    }
    firstRun = false;

    const categories = this.state.get('categories-selector');
    const subcategories = this.state.get('subcategories-selector');
    const filmId = this.state.get('film-selector');
    const state = this.state.get('state-selector');
    const city = this.state.get('city-selector');

    const noScreenings = this.state.get('no-screenings-selector');
    const teamMember = this.state.get('team-member-selector');
    const missingReports = this.state.get('missing-reports-selector');

    this.updateResults({
      categories,
      subcategories,
      filmId,
      state,
      city,
      noScreenings,
      teamMember,
      missingReports,
    });
  });
});

let CITIES;

Template.admAmbassadors.helpers({
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
        { label: 'E-mail', key: 'emails.0.address' },
        { label: 'Nome', key: 'profile.name' },
        { label: 'Celular', key: 'profile.cell_phone' },
        { label: 'Cidade', key: 'profile.city' },
        { label: 'Estado', key: 'profile.uf' },
        { label: 'Instituição', key: 'profile.institution' },
        { label: 'Área de atuação', key: 'profile.category' },
        { label: 'Temáticas', key: 'profile.subcategory' },
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
  states_options() {
    return getSelectOptions(STATES);
  },

  cities_options() {
    if (CITIES) {
      return CITIES;
    }
    const t = Template.instance();
    const cities = [];
    const screenings = t.state.get('filterData');

    _.each(screenings, function (screening) {
      if (screening.profile.city) {
        cities.push(screening.profile.city);
      }
    });

    CITIES = getSelectOptions(_.uniq(cities).sort());
    return CITIES;
  },
  categories_options() {
    return getSelectOptions(FILM_CATEGORIES);
  },
  subcategories_options() {
    return getSelectOptions(FILM_SUBCATEGORIES);
  },
});

Template.admAmbassadors.events({
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

    const filterData = instance.state.get('filterData');

    downloadCsvUser(filterData);
  },
});
