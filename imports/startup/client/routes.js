import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import { Films } from '../../api/films/films.js';

import '../../ui/layouts/app-body.js';

import '../../ui/pages/about.js';
import '../../ui/pages/ambassador-edit.js';
import '../../ui/pages/ambassador.js';
import '../../ui/pages/contact.js';
import '../../ui/pages/edit-screening.js';
import '../../ui/pages/films.js';
import '../../ui/pages/forget.js';
import '../../ui/pages/home.js';
import '../../ui/pages/login.js';
import '../../ui/pages/logout.js';
import '../../ui/pages/new-screening.js';
import '../../ui/pages/register.js';
import '../../ui/pages/report.js';
import '../../ui/pages/reset-password.js';
import '../../ui/pages/screenings.js';
import '../../ui/pages/show-film.js';

Router.configure({
  layoutTemplate: 'App_Body',
  loadingTemplate: 'loading',
});

Router.route('/', {
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },

  action() {
    this.render('home');
  },
});

Router.route('/about');
Router.route('/login');
Router.route('/denied');
Router.route('/forget');
Router.route('/register');
Router.route('/contact');

Router.route('/ambassador-edit');
Router.route('/films', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',

  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // const filmId = this.params._id;
    return Films.active();
  },

  action() {
    this.render('films');
  },
});
Router.route('/screenings', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',

  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // const filmId = this.params._id;
    return Films.active();
  },

  action() {
    this.render('screenings');
  },
});
Router.route('/ambassador', {
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // const filmId = this.params._id;
    return Films.screenings_by_user_id();
  },

  action() {
    this.render('ambassador');
  },
});

Router.route('/film/:slug', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',

  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },

  action() {
    this.render('showFilm');
  },
});


Router.route('/reset-password/:token', {
  template: 'resetPassword',
});

Router.route('/new-screening/:slug', {
  template: 'new-screening',

  waitOn() {
    return this.subscribe('films');
  },

  data() {
    Session.set('address', null);
    const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },
});

Router.route('/edit-screening/:_id', {
  name: 'edit-screening',
  template: 'editScreening',
  waitOn() {
    return this.subscribe('films');
  },
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});

Router.route('/report/:_id', {
  template: 'report',
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});

Router.route('/adm');
Router.route('/adm/sessions');
Router.route('/adm/ambassadors');

Router.route('/adm/films', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',

  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    Session.set('poster_path', null);
    // const filmId = this.params._id;
    return Films.active();
  },

  action() {
    this.render('admFilms');
  },
});

Router.route('/adm/films/:slug/edit', {
  template: 'admFilms',

  waitOn() {
    return this.subscribe('films');
  },

  data() {
    Session.set('poster_path', null);
    return Films.findOne({ slug: this.params.slug });
  },
});

Router.route('/adm/ambassador/:_id', {
  template: 'admAmbassador',
  data() {
    return Meteor.users.findOne({ _id: this.params._id });
  },
});


Router.route('/adm/session/:_id', {
  template: 'admSession',
  data() {
    const sessionId = this.params._id;
    return Films.return_screening(sessionId);
  },
});

Router.route('/adm/film/:_id/reports', {
  template: 'admReports',
  data() {
    const filmId = this.params._id;
    return Films.findOne({ _id: filmId });
  },
});

Router.route('/adm/report/:_id', {
  template: 'admReport',
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});

function mustBeSignedIn(pause) {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  }
  this.next();
}

function isAdmin(going) {
  const self = this;
  const userId = Meteor.userId();
  if (userId == null) {
    Router.go('login');
  }
  Meteor.users.find({ _id: Meteor.userId() }).map((user) => {
    if (user.profile.roles[0] === 'admin') {
      return self.next();
    }
    return Router.go('denied');
  });
}

const adminUris = [
  'adm',
  'adm/ambassador/:_id',
  'adm/film/:_id/reports',
  'adm/films',
  'adm/films',
  'adm/films/:slug/edit',
  'adm/report/:_id',
  'adm/session/:_id',
  'adm/sessions',
];
const signedInUris = [
  'ambassador',
  'ambassador-edit',
  'edit-screening/:_id',
  'new-screening/:slug',
  'report/:_id',
];

Router.onBeforeAction(mustBeSignedIn, { only: signedInUris });
Router.onBeforeAction(isAdmin, { only: adminUris });

// Router.onBeforeAction(fn, {only: ['index']});
