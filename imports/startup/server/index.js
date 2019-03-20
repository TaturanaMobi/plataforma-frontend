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
import Images from '../../models/images';
import { Cities, States } from '../../models/states_and_cities';
import Worker from './worker';
import NotificationTemplates from '../../models/notification_templates.js';

Meteor.startup(() => {
  Worker.start();

  Meteor.publish('films.all', () => Films.find({}, {
    fields: {
      screenings: 0,
    },
  }));

  Meteor.publish('screenings.all', () => Screenings.find({}));

  Meteor.publish('screenings.my', () => Screenings.find({ user_id: Meteor.userId() }));

  Meteor.publish('screenings.upcoming', () => Screenings.find({ status: 'Confirmada', public_event: true, date: { $gte: new Date() } }));

  Meteor.publish('users.me', () => Meteor.users.find({ _id: Meteor.userId() }));

  Meteor.publish('users.all', () => Meteor.users.find({}, { sort: { createdAt: -1 } }));

  Meteor.publish('notificationTemplates.all', () => NotificationTemplates.find({}));

  Meteor.publish('files.images.all', () => Images.find().cursor);

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

  addToSlideshow(id, image) {
    Films.update(id, {
      $push: {
        slideshow: image,
      },
    });
  },

  removeFromSlideshow(id, src) {
    const image = Films.get_image_by_src(id, src);
    Films.update(id, {
      $pull: {
        slideshow: image,
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
    const film = Films.by_screening_id(screeningId);
    const fScreening = Films.return_screening(screeningId);
    Films.update(
      {
        _id: film._id,
      },
      {
        $pull: {
          screening: fScreening,
        },
      },
    );
    // removeNotifications(screening_id);
  },
  addAddress(userId, newAddress) {
    Meteor.users.update(userId, {
      $push: {
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
