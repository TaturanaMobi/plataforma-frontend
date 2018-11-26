import { Meteor } from 'meteor/meteor';
import { Router } from 'meteor/iron:router';

import Films from './../../models/films';
// import Screenings from './../../models/screenings';

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
import '../../ui/components/denied.html';
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
  name: 'home',
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.findOne({ slug: this.params.slug }); },
  action() { this.render('home'); },
});

Router.route('/about', { name: 'about' });
Router.route('/login', { name: 'login' });
Router.route('/denied', { name: 'denied' });
Router.route('/forget', { name: 'forget' });
Router.route('/register', { name: 'register' });
Router.route('/contact', { name: 'contact' });

Router.route('/films', {
  name: 'films',
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.active(); },
  action() { this.render('films'); },
});
Router.route('/screenings', {
  name: 'screenings',
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.active(); },
  action() { this.render('screenings'); },
});

Router.route('/film/:slug', {
  name: 'showFilm',
  waitOn() { return Meteor.subscribe('films.all'); },
  data() { return Films.findOne({ slug: this.params.slug }); },
  action() { this.render('showFilm'); },
});

Router.route('/reset-password/:token', {
  name: 'resetPassword',
  template: 'resetPassword',
});

