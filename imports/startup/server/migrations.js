import { Meteor } from 'meteor/meteor';
import { Migrations } from 'meteor/percolate:migrations';
import { moment } from 'meteor/momentjs:moment';
// import { AutoForm } from 'meteor/aldeed:autoform';
import { STATES } from '../../models/schemas';
import Films from '../../models/films';
import Screenings from '../../models/screenings';
import NotificationTemplates from '../../models/notification_templates';
import { Cities, States } from '../../models/states_and_cities';
import Estados from '../../../backups/Municipios-Brasileiros/json/estados.json';
import Municipios from '../../../backups/Municipios-Brasileiros/json/municipios.json';
import statistics from '../../models/denormalizers/statistics.js';

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
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

function getScreeningStatus(s) {
  let status = 'Agendada';
  const now = new Date();

  if (moment(s.date).isBefore(now)) {
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
    const filenames = [
      'new_ambassador',
      'reset_password',
      'request_director_presence',
      'draft_weekly_remember',
      'admin_draft',
      'contact',
      'confirm_scheduling_3',
      'confirm_scheduling_9',
      'confirm_scheduling_10',
      'confirm_screening_date',
      'send_the_movie_3',
      'send_the_movie_9',
      'send_the_movie_10',
      'ask_for_report',
      'ask_for_report_take2',
      'tell_ambassador_the_results',
    ];

    const subjects = [
      'Bem vindo',
      'Esqueci minha senha',
      'Pedido de presença do diretor e/ou integrante da equipe do filme',
      'Você tem uma sessão em rascunho',
      'Você tem uma sessão com imprevisto ou problema',
      'Contato Site',
      'Precisamos saber como foi a sua sessão no dia {{screening.date_formated}}.',
      'Conte-nos como foi a sua sessão no dia {{screening.date_formated}}.',
      'Você tem uma sessão agendada!',
      'Você tem uma sessão agendada!',
      'Você tem uma sessão agendada!',
      'Tudo certo para a sua sessão?',
      'Download do filme {{film.title}}.',
      'Download do filme {{film.title}}.',
      'Download do filme {{film.title}}.',
      'Veja sua contribuição para a rede de impacto do {{film.title}}.',
    ];

    filenames.forEach((templateName, i) => {
      Assets.getText(`.templates/${templateName}.html`, function (error, data) { // eslint-disable-line
        NotificationTemplates.insert({
          name: `Genérico para ${templateName}`,
          trigger: templateName,
          subject: subjects[i],
          body: data,
        });
      });
    });
  },
  down() {
    NotificationTemplates.remove();
  },
});

Migrations.add({
  version: 2,
  up() {
    Films.find({}).forEach((film) => {
      if (film.screening !== undefined && film.screening.length > 0) {
        film.screening.forEach((screening) => {
          screening.filmId = film._id;
          screening.activity = toTitleCase(screening.activity) === 'Libre' ? 'Livre' : toTitleCase(screening.activity);
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
          if (screening.status === 'Rascunho') {
            screening.draft = true;
          }
          if (screening.status === 'Concluída') {
            screening.reportCreatedAt = new Date();
          }
          screening.street = toTitleCase(screening.street);
          screening.uf = (screening.uf.length > 3 ? '' : screening.uf);
          screening.created_at = (!screening.created_at ? screening.date : screening.created_at);
          screening.city = (!screening.city ? 'Não preenchido' : screening.city);
          screening.uf = (!screening.uf || !STATES.includes(screening.uf) ? 'NA' : screening.uf);
          screening.s_country = (!screening.s_country ? 'Não preenchido' : screening.s_country);
          screening.street = (!screening.street ? 'Não preenchido' : screening.street);
          screening.user_id = (!screening.user_id ? 'GwoHNFGPGkSJcycw6' : screening.user_id);
          screening.place_name = (!screening.place_name ? `Sem nome ${Math.random()}` : screening.place_name);
          screening.cep = convertInteger(screening.cep);
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

      film.duration = convertInteger(film.length);

      Films.update(film._id, {
        $set: {
          duration: film.duration,
        },
        $unset: {
          screening: '',
        },
      });
    });
  },
  down() {
    Screenings.remove();
  },
});


Migrations.add({
  version: 3,
  up() {
    Films.find({}).forEach((f) => {
      const s = Screenings.findOne({ filmId: f._id });
      if (typeof s !== 'undefined') {
        Screenings.update(s._id, { $set: { updatedAt: new Date() } });
      }
    });
  },
  down() {},
});

Migrations.add({
  version: 4,
  up() {
    const c = Cities.rawCollection();
    c.rename('cities_old', { dropTarget: true });
    const s = States.rawCollection();
    s.rename('states_old', { dropTarget: true });
    c.insert(Municipios);
    s.insert(Estados);
  },
  down() { },
});

Migrations.add({
  version: 5,
  up() {
    let i = 1;
    Films.find({}, { sort: { sequence_number: 1 } }).forEach((film) => {
      // console.log(film.sequence_number);
      Films.update(film._id, {
        $set: {
          sequence_number: i,
        },
      });
      i += 1;
    });
  },
  down() { },
});

Migrations.add({
  version: 6,
  up() {
    Films.find({}).forEach((film) => {
      statistics.updateFilm(film._id);
    });
  },
  down() { },
});

Meteor.startup(() => {
  Migrations.migrateTo('latest');
  Migrations.unlock();
  // Migrations.migrateTo('6,rerun');
});
