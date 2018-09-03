import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
  Template.homeCarouselItem.onRendered(() => {
    $('#carousel').slick({
      arrows: true,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 6000,
    });
    console.log('start carrousel');
  });

  Template.home.events({
    'click #home-films button': (event) => {
      Router.go('/screenings');
    },
  });

  Template.homeCarousel.helpers({
    disseminate() {
      return Films.find({ status:'Difusão' });
    },
    inventory() {
      return Films.inventory(this);
    },
  });

}
