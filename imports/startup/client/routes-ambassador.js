import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
// import { Session } from 'meteor/session';
import Films from '../../models/films.js';
import Screenings from '../../models/screenings.js';

import '../../ui/pages/report.js';

// Must be loggedIn

Router.route('/ambassador-edit', {
  name: 'ambassador-edit',
  waitOn() { return Meteor.subscribe('users.me'); },
  data() { return Meteor.users.findOne({ _id: Meteor.userId() }); },
  action() { this.render('ambassador-edit'); },
});

Router.route('/ambassador', {
  name: 'ambassador',
  waitOn() {
    return [Meteor.subscribe('screenings.my'), Meteor.subscribe('films.all')];
  },
  action() { this.render('ambassador'); },
});

Router.route('/new-screening/:slug', {
  template: 'new-screening',
  name: 'new-screening',

  waitOn() {
    return [
      this.subscribe('users.me'),
      this.subscribe('screenings.my'),
      this.subscribe('films.all'),
    ];
  },

  data() {
    // Session.set('address', null);
    // const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },
});

Router.route('/edit-screening/:_id', {
  name: 'edit-screening',
  waitOn() {
    return [
      this.subscribe('screenings.my'),
      this.subscribe('films.all'),
    ];
  },
  data() {
    return Screenings.findOne({ _id: this.params._id });
  },
  action() {
    this.render('editScreening');
  },
});

Router.route('/report/:_id', {
  name: 'report',
  template: 'report',
  waitOn() {
    return [this.subscribe('screenings.my'), this.subscribe('films.all')];
  },
  data() {
    return Screenings.findOne({ _id: this.params._id });
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
  'faq',
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
