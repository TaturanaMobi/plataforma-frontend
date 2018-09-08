import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
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
}
