import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import Films from '../../models/films.js';
import './carousel.html';

Template.homeCarousel.onRendered(() => {
  $('#carousel').slick({
    arrows: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 6000,
  });
});

Template.homeCarousel.helpers({
  disseminate() {
    return Films.all();
  },
});
