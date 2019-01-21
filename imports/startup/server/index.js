// Import server startup through a single index entry point
import { Meteor } from 'meteor/meteor';
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

// const FutureTasks = new Meteor.Collection('future_tasks');

// Envia as notifações
// function sendNotify(notify, template) {
//   Meteor.call('sendEmail', notify, template);
// }

// function missingReport(content, template) {
//   const report = Films.return_screening(content.screening_id);
//   if (report.real_quorum) {
//     return Meteor.call('sendEmail', content, template);
//   }
//   return false;
// }

// function removeNotifications(scrId) {
//   const scrTasks = FutureTasks.find({
//     screening_id: scrId,
//   }).fetch();

//   _.each(scrTasks, (task) => {
//     FutureTasks.remove(task._id);
//   });
// }

Meteor.methods({
  getSelectCities(options) {
    // this.unblock();
    const searchText = options.searchText;
    const values = options.values;

    if (searchText) {
      return Cities.find({ name: { $regex: searchText } }, { limit: 5 })
        .fetch()
        .map(v => ({ label: v.name, value: v.name }));
    } else if (values.length) {
      return Cities.find({ value: { $in: values } })
        .fetch()
        .map(v => ({ label: v.name, value: v.name }));
    }
    return Cities.find({}, { limit: 5 })
      .fetch()
      .map(v => ({ label: v.name, value: v.name }));
  },

  sendEmail(pidgeon, template) {
    // check(pidgeon, {to, replyTo});
    // check(template);
    this.unblock();
    // Assets.getText(template)
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
    const status = fScreening.status;
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
      }
    );
    if (status === 'admin-draft' || status) {
      removeNotifications(fScreening._id);
    }
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
      }
    );

    if (status == 'admin-draft' || status == true) {
      removeNotifications(id);
    }
  },
  removeScreening(screening_id) {
    const film = Films.by_screening_id(screening_id);
    const fScreening = Films.return_screening(screening_id);
    Films.update(
      {
        _id: film._id,
      },
      {
        $pull: {
          screening: fScreening,
        },
      }
    );
    removeNotifications(screening_id);
  },
  addAddress(user_id, new_address) {
    Meteor.users.update(user_id, {
      $push: {
        addresses: new_address,
      },
    });
  },
  removeAddress(user_id, address) {
    Meteor.users.update(user_id, {
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

Meteor.startup(() => {
  Worker.start();

  Meteor.publish('films.all', () => Films.find({}, {
    fields: {
      screenings: 0,
    },
  }));

  Meteor.publish('screenings.all', () => Screenings.find({}));

  Meteor.publish('screenings.my', () => Screenings.find({ user_id: Meteor.userId() }));

  // fields: {
  //   filmId: 1,
  //   user_id: 1,
  //   place_name: 1,
  //   city: 1,
  //   uf: 1,
  //   date: 1,
  //   public_event: 1,
  //   team_member: 1,
  //   quorum_expectation: 1,
  //   comments: 1,
  //   accept_terms: 1,
  //   created_at: 1,
  //   status: 1,
  //   real_quorum: 1,
  //   report_description: 1,
  //   author_1: 1,
  //   report_image_1: 1,
  //   author_2: 1,
  //   report_image_2: 1,
  //   author_3: 1,
  //   report_image_3: 1,
  // },

  Meteor.publish('users.me', () => Meteor.users.find({ _id: Meteor.userId() }));

  Meteor.publish('users.all', () => Meteor.users.find({}, { sort: { createdAt: -1 } }));

  // UploadServer.init({
  //   tmpDir: `${process.env.PWD}/uploads/tmp`,
  //   uploadDir: `${process.env.PWD}/uploads/`,
  //   checkCreateDirectories: true,
  //   getDirectory(fileInfo, formData) {
  //     return formData.contentType;
  //   },
  //   getFileName(fileInfo, formData) {
  //     const name = fileInfo.name.replace(/\s/g, '');
  //     return formData.file_type + name;
  //   },
  //   finished() {},
  //   cacheTime: 100,
  //   mimeTypes: {
  //     xml: 'application/xml',
  //     vcf: 'text/x-vcard',
  //   },
  // });

  Meteor.publish('files.images.all', () => Images.find().cursor);

  // Forgot Password Email
  Accounts.emailTemplates.siteName = 'Taturana Mobilização Social';
  Accounts.emailTemplates.from = 'Suporte <suporte@taturana.com.br>';
  Accounts.emailTemplates.resetPassword.subject = () => '[Taturana] Esqueci minha senha';

  Accounts.emailTemplates.resetPassword.text = (user, url) =>
    `Olá,\n\nPara resetar sua senha, acesse o link abaixo:\n${url}`;

  Accounts.urls.resetPassword = token => Meteor.absoluteUrl(`reset-password/${token}`);

  // Creating Slugs in Bulk for Existing Films
  // let count = 0;
  // const docs = Films.find({
  //   slug: {
  //     $exists: false,
  //   },
  // }, {
  //   limit: 50,
  // });

  // docs.forEach((doc) => {
  //   Films.update({
  //     _id: doc._id,
  //   }, {
  //     $set: {
  //       fake: '',
  //     },
  //   });
  //   count += 1;
  //   return count;
  // });
  // console.log(`Update slugs for ${count} Films.`);
});
