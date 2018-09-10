import { Template } from 'meteor/templating';

import { Films } from './../../api/films/films.js';
import './films.html';
import './../components/list-film.html';
import './../components/film-card.html';

Template.films.helpers({
  films() {
    return Films.active();
  },
});
