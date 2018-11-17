import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import Films from './../../models/films.js';

// Must be loggedIn

Router.route('/ambassador-edit', {
  name: 'ambassador-edit',
  waitOn() { return Meteor.subscribe('ambassadors'); },
});

Router.route('/ambassador', {
  name: 'ambassador',
  waitOn() {
    return [Meteor.subscribe('screenings'), Meteor.subscribe('films')];
  },
  action() { this.render('ambassador'); },
});

Router.route('/new-screening/:slug', {
  template: 'new-screening',
  name: 'new-screening',

  waitOn() {
    return this.subscribe('films');
  },

  data() {
    Session.set('address', null);
    // const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },
});

Router.route('/edit-screening/:_id', {
  name: 'edit-screening',
  waitOn() {
    return this.subscribe('films');
  },
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
  action() {
    this.render('editScreening');
  },
});

Router.route('/report/:_id', {
  name: 'report',
  template: 'report',
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});

export const publicRoutes = [
  'home',
  'about',
  'login',
  'denied',
  'forget',
  'register',
  'contact',
  'films',
  'screenings',
  'showFilm',
  'resetPassword',
];

function mustBeSignedIn() {
  if (!Meteor.userId()) {
    Router.go('login');
  }
  this.next();
}

Router.onBeforeAction(mustBeSignedIn, { except: publicRoutes });
