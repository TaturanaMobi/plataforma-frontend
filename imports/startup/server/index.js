/* eslint-disable */
// Import server startup through a single index entry point
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Email } from 'meteor/email';
import { SSR } from 'meteor/meteorhacks:ssr';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import './fixtures.js';
import './migrations';
import Films from '../../models/films';
import Screenings from '../../models/screenings';
import Notifications from '../../models/notifications';
import Images from '../../models/images';
import { Cities, States } from '../../models/states_and_cities';
import Worker from './worker';
import NotificationTemplates from '../../models/notification_templates.js';

Meteor.startup(() => {
  Worker.start();

  Meteor.publish('films.all', Films.all);

  Meteor.publish('screenings.all', function() { return Screenings.find({ status: { $ne: 'Cancelada' } }); });

  Meteor.publish('screenings.my', function() { return Screenings.find({ user_id: Meteor.userId(), status: { $ne: 'Cancelada' } }); });

  Meteor.publish('screenings.upcoming', function() { return Screenings.find({ status: 'Confirmada', public_event: true, date: { $gte: new Date() } }); });

  Meteor.publish('screenings.byFilm', function (filmId) { return Screenings.find({ filmId, status: 'Concluída' }); });

  Meteor.publish('users.me', function() { return Meteor.users.find({ _id: Meteor.userId() }); });

  Meteor.publish('users.all', function() { return Meteor.users.find({}, { sort: { createdAt: 1 } }); });

  Meteor.publish('notificationTemplates.all', function() { return NotificationTemplates.find({}); });

  Meteor.publish('notificationByScreening.byScreening', function(screeningId) { return Notifications.find({ screeningId }); });

  Meteor.publish('files.images.all', function() { return Images.find().cursor; });

  Meteor.publish('cities', function(uf) {
    if (typeof uf !== 'undefined' && uf.length > 0) {
      const stateUf = States.findOne({ uf });
      return Cities.find({ codigo_uf: stateUf.codigo_uf }, { fields: { nome: 1 } });
    }
    return this.ready();
  });

  // Forgot Password Email
  Accounts.emailTemplates.siteName = 'Taturana Mobilização Social';
  Accounts.emailTemplates.from = 'Suporte <suporte@taturana.com.br>';
  Accounts.emailTemplates.resetPassword.subject = () => '[Taturana] Esqueci minha senha';
  Accounts.emailTemplates.resetPassword.text = (user, url) => `Olá,\n\nPara resetar sua senha, acesse o link abaixo:\n${url}`;

  Accounts.urls.resetPassword = token => Meteor.absoluteUrl(`reset-password/${token}`);
});

Meteor.methods({
  getSelectCities(options) {
    // this.unblock();
    // check(options, { searchText: String, values: String });
    const { searchText, values } = options;

    if (searchText) {
      return Cities.find({ name: { $regex: searchText } }, { limit: 5 })
        .fetch()
        .map(v => ({ label: v.name, value: v.name }));
    }
    if (values.length) {
      return Cities.find({ value: { $in: values } })
        .fetch()
        .map(v => ({ label: v.name, value: v.name }));
    }
    return Cities.find({}, { limit: 5 })
      .fetch()
      .map(v => ({ label: v.name, value: v.name }));
  },

  sendEmail(pidgeon, template) {
    check(pidgeon, {
      to: String,
      from: String,
      replyTo: String,
      subject: String,
      name: String,
      email: String,
      message: String,
    });
    check(template, String);
    this.unblock();

    SSR.compileTemplate(template, Assets.getText(template));
    pidgeon.html = SSR.render(template, pidgeon);

    Email.send(pidgeon);
  },

  updateOrCreateFilm(film) {
    // check(film);
    const fId = film.id;
    delete film.id;

    if (fId === undefined || fId === '') {
      Films.insert(film);
    } else {
      Films.update(fId, {
        $set: {
          sequence_number: film.sequence_number,
          status: film.status,
          title: film.title,
          synopsis: film.synopsis,
          poster_path: film.poster_path,
          poster_thumb_path: film.poster_thumb_path,
          poster_home_path: film.poster_home_path,
          link_for_download: film.link_for_download,
          password_for_download: film.password_for_download,
          trailer_url: film.trailer_url,
          press_kit_path: film.press_kit_path,
          genre: film.genre,
          year: film.year,
          length: film.length,
          country: film.country,
          age_rating: film.age_rating,
          director: film.director,
          production_company: film.production_company,
          technical_information: film.technical_information,
          site: film.site,
          facebook: film.facebook,
          twitter: film.twitter,
          instagram: film.instagram,
          youtube: film.youtube,
        },
      });
    }
  },

  // insertTask(detail) {
  //   return FutureTasks.insert(detail);
  // },

  // scheduleNotify(id, content, template) {
  //   SyncedCron.add({
  //     name: content.subject,
  //     schedule(parser) {
  //       return parser.recur().on(content.when).fullDate();
  //     },
  //     job() {
  //       sendNotify(content, template);
  //       FutureTasks.remove(id);
  //       SyncedCron.remove(id);
  //       return id;
  //     },
  //   });
  // },

  // verifyReport(id, content, template) {
  //   SyncedCron.add({
  //     name: content.subject,
  //     schedule(parser) {
  //       return parser.recur().on(content.when).fullDate();
  //     },
  //     job() {
  //       missingReport(content, template);
  //       FutureTasks.remove(id);
  //       SyncedCron.remove(id);
  //       return id;
  //     },
  //   });
  // },

  removeFilm(id) {
    Films.remove(id);
  },

  reorderFilms(ids) {
    let i = 1;
    ids.forEach((id) => {
      const film = Films.findOne(id);
      Films.update(id, { $set: { sequence_number: i }});
      i += 1;
    });
  },

  addToSlideshow(id, image) {
    const f = Films.findOne(id);
    const s = f.slideshow;
    s.push(image);
    Films.update({ _id: id }, {
      $set: {
        'slideshow': s,
      },
    });
  },

  removeFromSlideshow(id, src) {
    const f = Films.findOne(id);

    f.slideshow.forEach((img, idx) => {
      if (img.src === src) {
        f.slideshow.splice(idx, 1);
      }
    });


    Films.update(id, {
      $set: {
        slideshow: f.slideshow,
      },
    });
  },

  updateScreening(fScreening) {
    // const { status } = fScreening;
    const film = Films.by_screening_id(fScreening._id);
    const screenings = film.screening;

    // fix this when have time, there is better ways to update an obj inside a
    // document array
    for (let i = 0; i < screenings.length; i += 1) {
      if (screenings[i]._id === fScreening._id) {
        fScreening.created_at = screenings[i].created_at;
        fScreening.user_id = screenings[i].user_id;
        fScreening.updated_at = new Date();
        screenings.splice(i, 1, fScreening);
      }
    }
    Films.update(
      {
        _id: film._id,
      },
      {
        $set: {
          screening: screenings,
        },
      },
    );
    // if (status === 'admin-draft' || status) {
    //   removeNotifications(fScreening._id);
    // }
    States.unsetHasScreenings(fScreening.s_country, fScreening.uf);
    Cities.unsetHasScreenings(fScreening.s_country, fScreening.uf, fScreening.city);

    States.setHasScreenings(fScreening.s_country, fScreening.uf);
    Cities.setHasScreenings(fScreening.s_country, fScreening.uf, fScreening.city);
  },
  setScreeningDraftStatus(id, status) {
    const film = Films.by_screening_id(id);
    const screenings = film.screening;

    _.each(screenings, (screening, i) => {
      if (screening._id === id) {
        screenings[i].draft = status;
      }
    });

    Films.update(
      {
        _id: film._id,
      },
      {
        $set: {
          screening: screenings,
        },
      },
    );

    // if (status === 'admin-draft' || status == true) {
    //   removeNotifications(id);
    // }
  },
  removeScreening(screeningId) {
    // const fScreening = Screenings.findOne(screeningId);
    // const film = fScreening.film();
    Screenings.update(
      {
        _id: screeningId,
      },
      {
        $set: {
          status: 'Cancelada',
        },
      },
    );
    // removeNotifications(screening_id);
  },
  addAddress(userId, newAddress) {
    Meteor.users.update(userId, {
      $addToSet: {
        addresses: newAddress,
      },
    });
  },
  removeAddress(userId, address) {
    Meteor.users.update(userId, {
      $pull: {
        addresses: address,
      },
    });
  },
  // updateUser(profile, email) {
  //   const user = Meteor.user();

  //   // Mantem o role do usuário
  //   profile.roles = user.profile.roles || ['ambassador'];

  //   Meteor.users.update(
  //     {
  //       _id: Meteor.userId(),
  //     },
  //     {
  //       $set: {
  //         profile,
  //       },
  //     }
  //   );
  //   Meteor.users.update(
  //     {
  //       _id: Meteor.userId(),
  //     },
  //     {
  //       $set: {
  //         'emails.0.address': email,
  //       },
  //     }
  //   );
  // },
});
