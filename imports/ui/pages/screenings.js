// import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';

import Films from '../../models/films.js';

import './screenings.html';
import Screenings from '../../models/screenings.js';

Template.screenings.helpers({
  films() {
    return Template.instance().state.get('films');
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

    return _.uniq(states).sort();
  },

  cities_options() {
    const cities = [];
    const screenings = Template.instance().state.get('screenings');

    _.each(screenings, function (screening) {
      if (screening.city) {
        cities.push(screening.city);
      }
    });

    return _.uniq(cities).sort();
  },

  screeningTotalCount() {
    return Template.instance().state.get('screenings').length;
  },

  filtered_films() {
    const instance = Template.instance();
    const films = instance.getFutureFilms();
    const filteredFilms = [];

    _.each(films, function (film) {
      const screenings = instance.state.get('screenings');
      const ownScreenings = [];
      _.each(screenings, function(screening) {
        if (screening.filmId === film._id) {
          ownScreenings.push(screening);
        }
      });

      if (ownScreenings.length > 0) {
        film.future_screenings = _.sortBy(ownScreenings, 'date');
        filteredFilms.push(film);
      }
    });

    return filteredFilms;
  },
});

Template.screenings.onCreated(function () {
  this.state = new ReactiveDict();

  const r = Router.current();

  this.state.setDefault('film-selector', r.params.query.filmSelector);
  this.state.setDefault('state-selector', r.params.query.stateSelector);
  this.state.setDefault('city-selector', r.params.query.citySelector);
  this.state.setDefault('month-selector', r.params.query.monthSelector);

  this.getFutureFilms = () => {
    const futureFilms = [];
    const films = Films.active().fetch();

    _.each(films, function (film) {
      const screenings = Template.instance().state.get('screenings');
      const ownScreenings = [];

      _.each(screenings, function(screening) {
        if (screening.filmId === film._id) {
          ownScreenings.push(screening);
        }
      });

      if (ownScreenings.length > 0) {
        futureFilms.push(film);
      }
    });

    return futureFilms;
  };

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
    console.log(o);
    return o;
  };

  this.updateResults = (filmId, state, city, month) => {
    const q = this.buildQuery(filmId, state, city, month);
    this.state.set('screenings', Screenings.find(q).fetch());
    this.state.set('films', this.getFutureFilms());
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

const updateFilters = (e, instance) => {
  const v = $(e.currentTarget).val();
  const n = e.currentTarget.id;

  instance.setFilter(n, v);
};

const resetFilters = (e, instance) => {
  // e.preventDefault();
  instance.setFilter('film-selector', '');
  instance.setFilter('state-selector', '');
  instance.setFilter('city-selector', '');
  instance.setFilter('month-selector', '');
};

Template.screenings.events({
  'change #city-selector': updateFilters,
  'change #state-selector': updateFilters,
  'click #month-selector': updateFilters,
  'click #film-selector': updateFilters,
  'click #btn-resetar': resetFilters,
});
