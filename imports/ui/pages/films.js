import { Template } from 'meteor/templating';

import Films from '../../models/films.js';
import './films.html';
import '../components/list-film.html';
import '../components/film-card.html';

Template.films.helpers({
  films() {
    return Films.active();
  },
});
