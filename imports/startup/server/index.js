// Import server startup through a single index entry point

// import './fixtures.js';
// import './register-api.js';

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { SSR } from 'meteor/meteorhacks:ssr';
import { Accounts } from 'meteor/accounts-base';
import { UploadServer } from 'meteor/tomi:upload-server';
import { _ } from 'meteor/underscore';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Films } from '../../api/films/films';
import { Cities, States } from '../../api/states_and_cities';

const FutureTasks = new Meteor.Collection('future_tasks');

// Envia as notifações
function sendNotify(notify, template) {
  Meteor.call('sendEmail', notify, template);
}

function missingReport(content, template) {
  const report = Films.return_screening(content.screening_id);
  if (report.real_quorum) {
    return Meteor.call('sendEmail', content, template);
  }
  return false;
}

function removeNotifications(scrId) {
  const scrTasks = FutureTasks.find({
    screening_id: scrId,
  }).fetch();

  _.each(scrTasks, (task) => {
    FutureTasks.remove(task._id);
  });
}

Meteor.methods({
  sendEmail(pidgeon, template) {
    this.unblock();
    // Assets.getText(template)
    SSR.compileTemplate(template, Assets.getText(template));
    pidgeon.html = SSR.render(template, pidgeon);

    Email.send(pidgeon);
  },

  updateOrCreateFilm(film) {
    const f_id = film.id;
    delete film.id;

    if (f_id === undefined || f_id === '') {
      Films.insert(film);
    } else {
      Films.update(f_id, {
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

  insertTask(detail) {
    return FutureTasks.insert(detail);
  },

  scheduleNotify(id, content, template) {
    SyncedCron.add({
      name: content.subject,
      schedule(parser) {
        return parser.recur().on(content.when).fullDate();
      },
      job() {
        sendNotify(content, template);
        FutureTasks.remove(id);
        SyncedCron.remove(id);
        return id;
      },
    });
  },

  verifyReport(id, content, template) {
    SyncedCron.add({
      name: content.subject,
      schedule(parser) {
        return parser.recur().on(content.when).fullDate();
      },
      job() {
        missingReport(content, template);
        FutureTasks.remove(id);
        SyncedCron.remove(id);
        return id;
      },
    });
  },

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

  addScreening(film_id, new_screening) {
    new_screening.created_at = new Date();

    Films.update(film_id, {
      $push: {
        screening: new_screening,
      },
    });
    States.setHasScreenings(new_screening.s_country, new_screening.uf);
    Cities.setHasScreenings(
      new_screening.s_country, new_screening.uf, new_screening.city
    );
    return new_screening._id;
  },

  updateScreening(f_screening) {
    const status = f_screening.status;
    const film = Films.by_screening_id(f_screening._id);
    const screenings = film.screening;

    // fix this when have time, there is better ways to update an obj inside a
    // document array
    for (let i = 0; i < screenings.length; i += 1) {
      if (screenings[i]._id === f_screening._id) {
        f_screening.created_at = screenings[i].created_at;
        f_screening.user_id = screenings[i].user_id;
        f_screening.updated_at = new Date();
        screenings.splice(i, 1, f_screening);
      }
    }
    Films.update({
      _id: film._id,
    }, {
      $set: {
        screening: screenings,
      },
    });
    if (status == 'admin-draft' || status == true) {
      removeNotifications(f_screening._id);
    }
    States.unsetHasScreenings(f_screening.s_country, f_screening.uf);
    Cities.unsetHasScreenings(
      f_screening.s_country, f_screening.uf, f_screening.city
    );

    States.setHasScreenings(f_screening.s_country, f_screening.uf);
    Cities.setHasScreenings(
      f_screening.s_country, f_screening.uf, f_screening.city
    );
  },
  setScreeningDraftStatus(id, status) {
    const film = Films.by_screening_id(id);
    const screenings = film.screening;

    _.each(screenings, (screening, i) => {
      if (screening._id === id) {
        screenings[i].draft = status;
      }
    });

    Films.update({
      _id: film._id,
    }, {
      $set: {
        screening: screenings,
      },
    });

    if (status == 'admin-draft' || status == true) {
      removeNotifications(id);
    }
  },
  removeScreening(screening_id) {
    const film = Films.by_screening_id(screening_id);
    const f_screening = Films.return_screening(screening_id);
    Films.update({
      _id: film._id,
    }, {
      $pull: {
        screening: f_screening,
      },
    });
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
  updateUser(profile, email) {
    const user = Meteor.user();

    // Mantem o role do usuário
    profile.roles = user.profile.roles || ['ambassador'];

    Meteor.users.update({
      _id: Meteor.userId(),
    }, {
      $set: {
        profile,
      },
    });
    Meteor.users.update({
      _id: Meteor.userId(),
    }, {
      $set: {
        'emails.0.address': email,
      },
    });
  },
});

Meteor.startup(() => {
  SyncedCron.start();

  Meteor.publish('films', () => Films.find({}));

  Meteor.publish('ambassadors', () => Meteor.users.find({}, {
    fields: {
      createdAt: 1,
      emails: 1,
      profile: 1,
      addresses: 1,
    },
  }));

  Meteor.publish('states', () => States.find({}));

  Meteor.publish('cities', () => Cities.find({}));

  UploadServer.init({
    tmpDir: `${process.env.PWD}/uploads/tmp`,
    uploadDir: `${process.env.PWD}/uploads/`,
    checkCreateDirectories: true,
    getDirectory(fileInfo, formData) {
      return formData.contentType;
    },
    getFileName(fileInfo, formData) {
      const name = fileInfo.name.replace(/\s/g, '');
      return formData.file_type + name;
    },
    finished(fileInfo, formFields) {},
    cacheTime: 100,
    mimeTypes: {
      xml: 'application/xml',
      vcf: 'text/x-vcard',
    },
  });

  // Forgot Password Email
  Accounts.emailTemplates.siteName = 'Taturana Mobilização Social';
  Accounts.emailTemplates.from = 'Suporte <suporte@taturana.com.br>';
  Accounts.emailTemplates.resetPassword.subject = () =>
    '[Taturana] Esqueci minha senha';

  Accounts.emailTemplates.resetPassword.text = (user, url) =>
    `Olá,\n\nPara resetar sua senha, acesse o link abaixo:\n${url}`;

  Accounts.urls.resetPassword = token => Meteor.absoluteUrl(`reset-password/${token}`);

  // Creating Slugs in Bulk for Existing Films
  let count = 0;
  const docs = Films.find({
    slug: {
      $exists: false,
    },
  }, {
    limit: 50,
  });

  docs.forEach((doc) => {
    Films.update({
      _id: doc._id,
    }, {
      $set: {
        fake: '',
      },
    });
    count += 1;
    return count;
  });
  console.log(`Update slugs for ${count} Films.`);
});
