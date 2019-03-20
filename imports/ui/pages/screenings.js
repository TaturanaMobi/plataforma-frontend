// import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';

import Films from '../../models/films.js';

import './screenings.html';
import Screenings from '../../models/screenings.js';

/* Pega filmes que tem sessão no futuro
 *
 * @return Array de filmes
 */
function getFutureFilms() {
  // retorna filmes com sessões futuras
  // let films;
  let screenings;
  // let future_screenings = [];
  const futureFilms = [];

  const films = Films.active().fetch();

  // films = films.fetch();

  _.each(films, function (film) {
    screenings = Screenings.find({ filmId: film._id }).fetch() || [];

    // _.each(screenings, function (screening) {
    //   if (in_future(screening.date)) {
    //     future_screenings.push(screening);
    //   }
    // });

    if (screenings.length > 0) {
    //   film.future_screenings = future_screenings;
      futureFilms.push(film);
    //   future_screenings = [];
    }
  });

  return futureFilms;
}

Template.screenings.helpers({
  films() {
    return getFutureFilms();
  },

  month_options() {
    const months = [];
    const screenings = Screenings.find({}).fetch();

    _.each(screenings, function (screening) {
      if (screening.date) {
        const formatedDate =
          `${new Intl.DateTimeFormat('en-US', { month: 'long' }).format(screening.date)} ${new Date(screening.date).getFullYear()}`;
        months.push(formatedDate);
      }
    });

    return _.uniq(months);
  },

  states_options() {
    const states = [];
    const screenings = Screenings.find({}).fetch();

    _.each(screenings, function (screening) {
      if (screening.uf) {
        states.push(screening.uf);
      }
    });

    return _.uniq(states);
  },

  cities_options() {
    const cities = [];
    const screenings = Screenings.find({}).fetch();

    _.each(screenings, function (screening) {
      if (screening.city) {
        cities.push(screening.city);
      }
    });

    return _.uniq(cities);
  },

  filtered_films() {
    const instance = Template.instance();

    // filmes com sessões futuras e obedecendo filtros
    let films = getFutureFilms(true),
      // screenings,
      future_screenings = [],
      filtered_films = [];

    _.each(films, function (film) {
      // screenings = film.future_screenings || [];
      // console.log();
      _.each(Screenings.find({ filmId: film._id}).fetch(), function (screening) {
        // applica filtros
        let filtered_city = Session.get('city'),
          filtered_state = Session.get('state'),
          filtered_month = Session.get('month'),
          filtered_title = Session.get('title');

        if ((!filtered_city || screening['city'] == filtered_city) &&
            (!filtered_state || screening['uf'] == filtered_state) &&
            (!filtered_month || screening['date'].getMonth()+1 == filtered_month) &&
            (!filtered_title || screening['title'] == filtered_title) &&
            !screening['draft']) {
          future_screenings.push(screening);
        }
      });

      if (future_screenings.length > 0) {
        film.future_screenings = _.sortBy(future_screenings, 'date');
        filtered_films.push(film);
        future_screenings = [];
      }
    });

    return filtered_films;
  },
});

Template.screenings.onCreated(() => {
  this.state = new ReactiveDict();

});

// Template.screenings.events({
//   'change #city-selector': function (e) {
//     const city = $(e.currentTarget).val();
//     Session.set('city', city);
//   },
//   'change #st-selector': function (e) {
//     const state = $(e.currentTarget).val();
//     Session.set('state', state);
//   },
//   'change #title-selector': function (e) {
//     const title = $(e.currentTarget).val();
//     Session.set('title', title);
//   },
//   'click .btn-datepicker': function (e) {
//     const month = $(e.currentTarget).data('month');
//     Session.set('month', month);
//   },
//   'click #film-selector': function (e) {
//     const film = $(e.currentTarget).val();
//     Session.set('film', film);
//   },
// });


// function in_future(date) {
//   const today = new Date();

//   return (date.getTime() > today.getTime());
// }
