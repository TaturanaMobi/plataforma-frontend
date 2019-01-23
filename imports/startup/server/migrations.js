import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import Films from '../../models/films';
import Screenings from '../../models/screenings';

function convertInteger(value) {
  if (value === undefined) {
    return 0;
  }
  const n = `${value} `.match(/\d+/g);
  if (n !== null && n.length > 0) {
    return n.map(Number)[0];
  }
  return 0;
}

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

function getScreeningStatus(s) {
  let status = 'Agendada';
  const now = new Date();

  if (s.date < now) {
    status = 'Pendente';
  }

  if (s.report_description !== undefined) {
    status = 'Concluída';
  }

  if (s.draft !== undefined) {
    status = 'Rascunho';
  }

  return status;
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
          screening.status = getScreeningStatus(screening);
          if (screening.status === 'Concluída') {
            screening.reportCreatedAt = new Date();
          }
          screening.street = toTitleCase(screening.street);
          screening.uf = (screening.uf.length > 3 ? '' : screening.uf);
          screening.created_at = (!screening.created_at ? '' : screening.created_at);
          screening.city = (!screening.city ? 'Não preenchido' : screening.city);
          screening.uf = (!screening.uf ? 'NA' : screening.uf);
          screening.s_country = (!screening.s_country ? 'Não preenchido' : screening.s_country);
          screening.street = (!screening.street ? 'Não preenchido' : screening.street);
          screening.user_id = (!screening.user_id ? 'GwoHNFGPGkSJcycw6' : screening.user_id);
          screening.place_name = (!screening.place_name ? `Sem nome ${Math.random()}` : screening.place_name);
          screening.number = convertInteger(screening.number);
          screening.real_quorum = convertInteger(screening.real_quorum);
          screening.quorum_expectation = convertInteger(screening.quorum_expectation);
          screening.accept_terms = true;
          screening.activity = (!screening.activity ? 'Debate' : screening.activity);
          screening.comments = (!screening.comments ? 'Sem comentários.' : screening.comments);
          screening.oldId = screening._id;
          delete screening._id;
          Screenings.insert(screening);
        });
      }

      // delete film.screening;
      film.duration = convertInteger(film.length);

      Films.update(film._id, {
        $set: {
          duration: film.duration,
        },
      });
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
