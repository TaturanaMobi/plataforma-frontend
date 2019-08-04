import { Router } from 'meteor/iron:router';
import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import { analytics } from 'meteor/okgrow:analytics';

import Films from '../../models/films';

import '../../ui/layouts/app-body.js';
import '../../ui/pages/about.js';
import '../../ui/pages/ambassador-edit.js';
import '../../ui/pages/ambassador.js';
import '../../ui/pages/contact.js';
import '../../ui/pages/faq.js';
import '../../ui/pages/edit-screening.js';
import '../../ui/pages/films.js';
import '../../ui/pages/forget.js';
import '../../ui/pages/home.js';
import '../../ui/pages/login.js';
import '../../ui/components/denied.html';
import '../../ui/pages/new-screening.js';
import '../../ui/pages/register.js';
import '../../ui/pages/reset-password.js';
import '../../ui/pages/screenings.js';
import '../../ui/pages/show-film.js';

Template.App_Body.onRendered(function() {
  Tracker.autorun(() => {
    document.title = `Plataforma Taturana - ${Router.current().route.getName()}`;

    // Feature detects Navigation Timing API support.
    if (window.performance) {
      // Gets the number of milliseconds since page load
      // (and rounds the result since the value must be an integer).
      const timeSincePageLoad = Math.round(performance.now());

      // Sends the timing hit to Google Analytics.
      analytics.track('JS Dependencies', { eventName: 'timing', couponValue: timeSincePageLoad });
    }
  });
});

Router.configure({
  layoutTemplate: 'App_Body',
  loadingTemplate: 'loading',
});

Router.route('/', {
  name: 'home',
  waitOn() { return this.subscribe('films.all'); },
  // data() { return Films.find({}); },
  action() { this.render('home'); },
});

Router.route('/about', { name: 'about' });
Router.route('/login', { name: 'login' });
Router.route('/denied', { name: 'denied' });
Router.route('/forget', { name: 'forget' });

Router.route('/register', {
  name: 'register',
  // waitOn() { return Meteor.subscribe('users'); },
  // data() { return Films.findOne({ slug: this.params.slug }); },
  action() { this.render('register'); },
});

Router.route('/contact', { name: 'contact' });
Router.route('/faq', { name: 'faq' });

Router.route('/films', {
  name: 'films',
  waitOn() { return this.subscribe('films.all'); },
  // data() { return Films.active(); },
  action() { this.render('films'); },
});

Router.route('/screenings', {
  name: 'screenings',
  waitOn() {
    return this.subscribe('films.all') && this.subscribe('screenings.upcoming');
  },
  // data() { return Films.active(); },
  action() { this.render('screenings'); },
});

Router.route('/film/:slug', {
  name: 'showFilm',
  waitOn() { return this.subscribe('films.all'); },
  data() { return Films.findOne({ slug: this.params.slug }); },
  action() { this.render('showFilm'); },
});

Router.route('/reset-password/:token', {
  name: 'resetPassword',
  template: 'resetPassword',
});
