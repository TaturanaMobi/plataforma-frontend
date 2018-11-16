import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';
import { $ } from 'meteor/jquery';
import Films from './../../models/films.js';

import '../../ui/components/adm-sidebar.html';

import './../../ui/pages/admin/adm-ambassador.html';
import './../../ui/pages/admin/adm-ambassadors.html';
import './../../ui/pages/admin/adm-ambassadors.js';
import './../../ui/pages/admin/adm-films.html';
import './../../ui/pages/admin/adm-films.js';
import './../../ui/pages/admin/adm-report.html';
import './../../ui/pages/admin/adm-report.js';
import './../../ui/pages/admin/adm-reports.html';
import './../../ui/pages/admin/adm-reports.js';
import './../../ui/pages/admin/adm-session.html';
import './../../ui/pages/admin/adm-session.js';
import './../../ui/pages/admin/adm-sessions.html';
import './../../ui/pages/admin/adm-sessions.js';
import './../../ui/pages/admin/adm-sessions2.html';
import './../../ui/pages/admin/adm-sessions2.js';
import './../../ui/pages/admin/adm.html';
import Screenings from '../../models/screenings.js';

// Router.configure({
//   layoutTemplate: 'App_Body',
//   loadingTemplate: 'loading',
// });

Router.route('/adm');
Router.route('/adm/sessions', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',

  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    // Session.set('poster_path', null);
    // const filmId = this.params._id;
    return Films.find({});
  },

  action() {
    this.render('admSessions');
  },
});

Router.route('/adm/sessions2', {
  // this template will be rendered until the subscriptions are ready
  // loadingTemplate: 'loading',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('screenings');
  },

  data() {
    // Session.set('poster_path', null);
    // const filmId = this.params._id;
    return Screenings.find({});
  },

  action() {
    this.render('admSessions2');
  },
});

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
  action() {
    this.render('admFilms');
    $('.nav-tabs li:eq(0) a').tab('show');
  },
});

Router.route('/adm/ambassador/:_id', {
  template: 'admAmbassador',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    return Meteor.users.findOne({ _id: this.params._id });
  },
});


Router.route('/adm/session/:_id', {
  template: 'admSession',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    const sessionId = this.params._id;
    return Films.return_screening(sessionId);
  },
});

Router.route('/adm/film/:_id/reports', {
  template: 'admReports',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    const filmId = this.params._id;
    return Films.findOne({ _id: filmId });
  },
});

Router.route('/adm/report/:_id', {
  template: 'admReport',
  waitOn() {
    // return one handle, a function, or an array
    return Meteor.subscribe('films');
  },

  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});

function mustBeSignedIn() {
  if (!(Meteor.user() || Meteor.loggingIn())) {
    Router.go('login');
  }
  console.log
  this.next();
}

function isAdmin() {
  const self = this;
  const userId = Meteor.userId();
  if (userId == null) {
    Router.go('login');
  }
  Meteor.users.find({ _id: userId }).map((user) => {
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
