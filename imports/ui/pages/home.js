import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import { Films } from '../../api/films/films.js';

import './../components/carousel.html';
import './../components/carousel-item.html';
import './home.html';

Template.homeCarousel.onRendered(() => {
  $('#carousel').slick({
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
  });
});

Template.home.events({
  'click #home-films button': () => {
    Router.go('/screenings');
  },
});

Template.homeCarousel.helpers({
  disseminate() {
    return Films.find({ status: 'Difusão' });
  },
  inventory() {
    return Films.inventory(Template.currentData());
  },
});
