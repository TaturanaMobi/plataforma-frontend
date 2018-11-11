import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Films from '../../api/films/films';
import Screenings from '../../api/screenings/screenings';

function convertInteger(value) {
  if (value === undefined) {
    return 0;
  }
  const n = value.match(/\d+/g);
  if (n !== null && n.length > 0) {
    return n.map(Number)[0];
  }
  return 0;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

Migrations.add({
  version: 1,
  up() {
    Films.find({}).forEach((film) => {
      if (film.screening !== undefined && film.screening.length > 0) {
        film.screening.forEach((screening) => {
          screening.filmId = film._id;
          screening.activity = toTitleCase(screening.activity);
          screening.activity_theme = toTitleCase(screening.activity_theme);
          screening.zone = toTitleCase(screening.zone);
          screening.s_country = toTitleCase(screening.s_country);
          if (screening.author_1) {
            screening.author_1 = toTitleCase(screening.author_1);
          }
          if (screening.author_2) {
            screening.author_2 = toTitleCase(screening.author_2);
          }
          if (screening.author_3) {
            screening.author_3 = toTitleCase(screening.author_3);
          }

          screening.street = toTitleCase(screening.street);
          screening.uf = (screening.uf.length > 3 ? '' : screening.uf);
          screening.created_at = (screening.created_at === null ? '' : screening.created_at);
          screening.cep = (String(convertInteger(screening.cep)).length <= 5
            ? 11111111 : convertInteger(screening.cep));
          screening.number = convertInteger(screening.number);
          screening.real_quorum = convertInteger(screening.real_quorum);
          screening.quorum_expectation = convertInteger(screening.quorum_expectation);
          delete screening._id;

          Screenings.insert(screening);
        });
      }
    });
  },
  down() {
    Screenings.remove();
  },
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  Migrations.unlock();
  // Migrations.migrateTo('1,rerun');
});
