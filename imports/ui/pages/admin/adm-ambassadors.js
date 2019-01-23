/* global document, window */

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';
import { Papa } from 'meteor/harrison:papa-parse';

import Films from '../../../models/films.js';

const hasValue = prop => prop !== undefined && prop.value.length > 0;

const filteredAmbassadors = () => {
  // const filters = Session.get('ambassadorsFilters') || {};
  const filters = {};
  const findAttrs = _.pick(filters, ['profile.category', 'profile.subcategory', 'profile.city', 'profile.uf']);

  let users = Meteor.users.find(findAttrs).fetch();

  if (filters.noScreenings) {
    users = _.filter(users, user => Films.find({
      'screening.user_id': user._id,
    }).count() === 0);
  }

  if (filters.pendingReport) {
    // TODO
    console.log('IMPLEMENT pendingReport');
  }

  if (filters.teamMember) {
    users = _.filter(users, user => Films.find({
      'screening.user_id': user._id,
      'screening.team_member': true,
    }).count() > 0);
  }

  if (filters.filmDisplayed) {
    users = _.filter(users, (user) => {
      const titles = Films.find({
        'screening.user_id': user._id,
      }).fetch().map(film => film.title);
      return titles.indexOf(filters.filmDisplayed) > -1;
    });
  }
  return users;
};

Meteor.subscribe('ambassadors');

Template.admAmbassadors.helpers({
  settings() {
    const instance = Template.instance();
    return {
      collection: instance.data,
      // filters: ['filterTeamMember'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      fields: [
      //   { label: 'Ações', key: 'actions', tmpl: Template.actionsCellTmpl2 },
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

  ambassadors() {
    return filteredAmbassadors();
  },

  films() {
    return Films.all();
  },

  firstAddress(emails) {
    return emails[0].address;
  },

  get_place_data(dataType) {
    const placeData = [];
    const ambassadors = Meteor.users.find({}, {
      fields: {
        'profile.city': 1,
        'profile.uf': 1,
      },
    }).fetch();
    _.each(ambassadors, (ambassador) => {
      if (ambassador.profile) {
        placeData.push(ambassador.profile[dataType]);
      }
    });
    return _.uniq(placeData).sort();
  },
});

Template.admAmbassadors.events({
  'submit #ambassadors-filters'(event) {
    event.preventDefault();
    const el = event.target;

    const filters = {
      noScreenings: el.noScreenings.checked,
      pendingReport: el.pendingReport.checked,
      teamMember: el.teamMember.checked,
      profile: {
        category: '',
        subcategory: '',
        city: '',
        uf: '',
      },
    };

    if (hasValue(el.category)) {
      filters.profile.category = el.category.value;
    }
    if (hasValue(el.subcategory)) {
      filters.profile.subcategory = el.subcategory.value;
    }
    if (hasValue(el.filmDisplayed)) {
      filters.filmDisplayed = el.filmDisplayed.value;
    }
    if (hasValue(el.city)) {
      filters.profile.city = el.city.value;
    }
    if (hasValue(el.uf)) {
      filters.profile.uf = el.uf.value;
    }

    // Session.set('ambassadorsFilters', filters);
  },

  'click .csv-export'(event) {
    event.preventDefault();
    const data = filteredAmbassadors().map((u) => {
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
  },
});
