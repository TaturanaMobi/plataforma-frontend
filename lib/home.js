import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';

import { Films } from '../imports/api/films/films.js';

if (Meteor.isClient) {
  Template.homeCarouselItem.rendered = function () {
    setTimeout(function () {
      $('#carousel').slick({
        arrows: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000,
      });
    }, 500);
  };

  Template.home.events({
    'click #home-films button': function (event) {
      Router.go('/screenings');
    },
  });

  Template.homeCarousel.helpers({
    disseminate: function () {
      return Films.find({ status:'Difusão' });
    },
    inventory: function () {
      return Films.inventory(this);
    },
  });

}
