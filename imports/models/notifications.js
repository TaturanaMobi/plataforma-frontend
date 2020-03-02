import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';
import { SSR } from 'meteor/meteorhacks:ssr';
import { moment } from 'meteor/momentjs:moment';
import Schemas from './schemas';
import NotificationTemplates from './notification_templates';
import Screenings from './screenings';

const Notifications = new Mongo.Collection('notifications');
Notifications.attachSchema(Schemas.Notification);

if (Meteor.isServer) {
  Notifications.before.insert((userId, doc) => {
    doc.createdAt = new Date();
  });
  Notifications.before.upsert((userId, doc) => {
    doc.updatedAt = new Date();
  });
  Notifications.after.insert((userId, doc) => {
    const template = NotificationTemplates.findOne({ _id: doc.notificationTemplateId });
    const user = Meteor.users.findOne({ _id: doc.userId });
    const screening = Screenings.findOne({ _id: doc.screeningId });
    const to = user.emails[0].address;
    screening.date_formated = moment(screening.date).format('DD/MM/YYYY');
    const varsData = {
      screening,
      film: screening.film(),
      ambassador: screening.ambassador(),
      absoluteurl: Meteor.absoluteUrl(),
    };

    SSR.compileTemplate('subject', template.subject);
    const compiledSubject = SSR.render('subject', varsData);

    const pidgeon = {
      to,
      from: 'Plataforma Taturana Mobi<contato@taturanamobi.com.br>',
      subject: compiledSubject,
    };

    SSR.compileTemplate(template.name, template.body);
    pidgeon.html = SSR.render(template.name, varsData);

    Email.send(pidgeon);

    Notifications.update({ _id: doc._id }, { $set: { deliveredAt: new Date() } });
    // console.log('Enviando e-mail:', doc);
  });
}

export default Notifications;
