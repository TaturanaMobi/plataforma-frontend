import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
// import { $ } from 'meteor/jquery';

import { FilmScreeningInventory } from '../film-screening-inventory';
import Films from '../films';
import Screenings from '../screenings';

// Inventory functions
function incrementOrCreate(obj, key, increment) {
  increment = increment || 1;

  obj[key] = (key in obj) ? (obj[key] + increment) : increment;
  return obj;
}

function getMonthName(month) {
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return monthNames[month];
}

function getZoneByState(state) {
  const zones = {
    Sudeste: ['SP', 'ES', 'MG', 'RG'],
    Sul: ['PR', 'SC', 'RS'],
    'Centro-Oeste': ['DF', 'GO', 'MS', 'MT'],
    Nordeste: ['BA', 'AL', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    Norte: ['AM', 'PA', 'RO', 'RR', 'AC', 'AP', 'TO'],
  };

  _.each(zones, (states, zone) => {
    if (states.indexOf(state) > 0) {
      return zone;
    }
    return null;
  });
}

const calculateStatistics = (legacyData, screenings) => {
  // const legacyData = FilmScreeningInventory[film.title];
  // const screenings = Screenings.find({ filmId: film._id }).fetch() || [];

  const statistics = legacyData;

  const now = new Date();
  const states = [];
  const cities = [];
  const users = [];

  // const scr_id_real = [];
  _.each(screenings, (screening) => {
    // sessões - Sessões que não são rascunho
    const realQuorum = parseInt(screening.real_quorum, 10);

    if (!('draft' in screening) || ('draft' in screening && screening.draft === false)) {
      // sessoes jah exibidas
      if ((screening.status !== 'Inválida') && (screening.status !== 'Rascunho') && (screening.date < now)) {
        statistics.past_sessions += 1;
        // sessões com relatorio que ja foram exibidas
        if (screening.report_description) {
          statistics.viewers_from_reports = parseInt(
            statistics.viewers_from_reports, 10,
          ) + realQuorum;
          statistics.sessions_with_reports = parseInt(
            statistics.sessions_with_reports, 10,
          ) + 1;
        }
      } else if ((screening.status !== 'Inválida') && (screening.status !== 'Rascunho')) {
        // sessoes a serem exibidas
        statistics.future_sessions += 1;
      }

      statistics.sessions += 1;
      // Espectadores por mês

      if (realQuorum > 0) {
        // realQuorum = parseInt(realQuorum);
        statistics.viewers += realQuorum;
        incrementOrCreate(
          statistics.viewers_per_month,
          `${getMonthName(screening.date.getMonth())} - ${screening.date.getFullYear()}`, realQuorum,
        );
      }

      // Estados e viewers por area
      if ('uf' in screening) {
        states.push(screening.uf);
        if (getZoneByState(screening.uf)) {
          incrementOrCreate(statistics.viewers_zones, getZoneByState(screening.uf));
        }
      }

      // quais cidades
      cities.push(screening.city);

      // Usuários
      if (screening.user_id) {
        users.push(Meteor.users.findOne(screening.user_id));
      }
    }
  });

  if (users.length > 0) {
    _.each(users, (user) => {
      // Categorias e subcategorias dos embaixadores?
      if (user && user.profile && user.profile.name !== 'admin') {
        incrementOrCreate(statistics.categories, user.profile.category);
        incrementOrCreate(statistics.subcategories, user.profile.subcategory);
      }
    });
  }
  statistics.cities_total += _.uniq(cities).length;
  statistics.states = _.uniq(states.concat(statistics.states));
  // Não retorna inventorio sem sessões
  // if (statistics.sessions > 0) {
  return statistics;
  // }
};

export default {
  _updateFilm(filmId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const screenings = Screenings.find({
      filmId,
    }, { sort: { date: 1 } }).fetch();
    const film = Films.findOne(filmId);

    const legacyData = FilmScreeningInventory[film.title];
    const initialInventory = {
      viewers: 0,
      viewers_from_reports: 0,
      viewers_per_month: {},
      legacy_viewers: 0,
      sessions: 0,
      sessions_with_reports: 0,
      scheduled_sessions: 0,
      states: [],
      cities: [],
      cities_total: 0,
      categories: {},
      subcategories: {},
      viewers_zones: {},
      past_sessions: 0,
      future_sessions: 0,
    };

    const statistics = calculateStatistics(_.extend({}, initialInventory, legacyData), screenings);

    Films.update(filmId, { $set: { statistics } });
  },
  afterInsertScreening(s) {
    this._updateFilm(s.filmId);
  },
  // afterUpdateScreening(selector, modifier) {
  // We only support very limited operations on todos
  // check(modifier, {$set: Object});

  // We can only deal with $set modifiers, but that's all we do in this app
  // if (_.has(modifier.$set, 'checked')) {
  //   Todos.find(selector, {fields: {listId: 1}}).forEach(todo => {
  //     this._updateList(todo.listId);
  //   });
  // }
  // },
  // Here we need to take the list of todos being removed, selected *before* the update
  // because otherwise we can't figure out the relevant list id(s) (if the todo has been deleted)
  afterRemoveTodos(todos) {
    todos.forEach((todo) => this._updateList(todo.listId));
  },
};
