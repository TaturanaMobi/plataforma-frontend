/* eslint-disable */
// Import server startup through a single index entry point
import * as fs from 'fs';
import FileType from 'file-type';
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
import Users from '../../models/users.js';
import Schemas from '../../models/schemas'

Users.after.insert((userId, doc) => {
  const nt = NotificationTemplates.findOne({ trigger: 'new_ambassador' });
  const vars = {
    'notificationTemplateId': nt._id,
    'userId': doc._id
  };
  Notifications.attachSchema(Schemas.Notification);
  Notifications.insert(vars);
  return true;
});

Meteor.startup(() => {
  Worker.start();

  Meteor.publish('films.all', Films.all);

  Meteor.publish('screenings.all', function() { return Screenings.find({}); });

  Meteor.publish('screenings.my', function() { return Screenings.find({ user_id: Meteor.userId(), status: { $ne: 'Cancelada' } }); });

  Meteor.publish('screenings.upcoming', function() { return Screenings.find({ status: 'Confirmada', public_event: true, date: { $gte: new Date() } }); });

  Meteor.publish('screenings.byFilm', function (filmId) { return Screenings.find({ filmId, status: 'Concluída' }); });

  Meteor.publish('users.me', function() { return Users.find({ _id: Meteor.userId() }); });

  Meteor.publish('users.all', function() { return Users.find({}, { sort: { createdAt: 1 } }); });

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

  Router.route('/old_uploads/:path(.*)',
    function () {
      var filePath = process.env.PWD + '/uploads/' + this.params.path;
      var data = fs.readFileSync(filePath);

      const that = this;
      FileType.fromFile(filePath).then((r) => {
        that.response.writeHead(200, {
          'Content-Type': r.mime
        });
        that.response.write(data);
        that.response.end();
      })
    }, {where: 'server'}
  );
});

Meteor.methods({
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
    Users.update(userId, {
      $addToSet: {
        addresses: newAddress,
      },
    });
  },
  removeAddress(userId, address) {
    Users.update(userId, {
      $pull: {
        addresses: address,
      },
    });
  },
});
