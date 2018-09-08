import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';

import './../components/carousel.js';
import './../components/carousel-item.html';
import './home.html';

Template.home.events({
  'click #home-films button': () => {
    Router.go('/screenings');
  },
});
