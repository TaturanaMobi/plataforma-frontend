import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';
import { Session } from 'meteor/session';

import Films from '../../api/films/films.js';

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
    // const filmId = this.params._id;
    return Films.findOne({ slug: this.params.slug });
  },
});

Router.route('/edit-screening/:_id', {
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
  template: 'report',
  data() {
    return Films.return_film_and_screening(this.params._id);
  },
});
