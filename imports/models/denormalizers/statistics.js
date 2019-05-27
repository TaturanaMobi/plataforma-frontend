// import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
// import { $ } from 'meteor/jquery';

import { FilmScreeningInventory } from '../film-screening-inventory';
import Films from '../films';
import Screenings from '../screenings';

export default {
  _updateFilm(filmId) {
    // Recalculate the correct incomplete count direct from MongoDB
    const screenings = Screenings.find({
      filmId,
    });
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
      film,
    };

    const statistics = _.extend({}, initialInventory, legacyData);

    if (legacyData) {
      statistics.legacy_viewers = legacyData.viewers;
    }

    statistics.scheduled_sessions += screenings.length;
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
    todos.forEach(todo => this._updateList(todo.listId));
  },
};
