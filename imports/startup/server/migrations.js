import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Films from '../../api/films/films';
import Screenings from '../../api/screenings/screenings';

Migrations.add({
  version: 1,
  up() {
    Films.find({}).forEach((film) => {
      if (film.screening !== undefined && film.screening.length > 0) {
        film.screening.forEach((screening) => {
          console.log(screening._id);
          screening.filmId = film._id;
          screening.number = screening.number.match(/\d+/g).map(Number);
          screening.real_quorum = screening.real_quorum ? screening.real_quorum.match(/\d+/g).map(Number) : 0;
          screening.expectation_quorum = screening.quorum_expectation.match(/\d+/g).map(Number);
          delete screening._id;
          Screenings.insert(screening, { validate: false });
        });
      }
    });
  },
  down() {
    Screenings.remove();
  },
});

Meteor.startup(() => {
  // Migrations.migrateTo('latest');
  Migrations.unlock();
  Migrations.migrateTo('1,rerun');
});
