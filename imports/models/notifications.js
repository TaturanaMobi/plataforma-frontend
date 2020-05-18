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

Notifications.allow({
  insert() {
    return true;
  },

  update() {
    return true;
  },
});

if (Meteor.isServer) {
  Notifications.before.insert((userId, doc) => {
    doc.createdAt = new Date();
  });
  Notifications.before.upsert((userId, doc) => {
    doc.updatedAt = new Date();
  });
  Notifications.after.insert((userId, doc) => {
    // console.log(doc);
    const template = NotificationTemplates.findOne({ _id: doc.notificationTemplateId });
    const user = Meteor.users.findOne({ _id: doc.userId });
    const varsData = {
      ambassador: user,
      absoluteurl: Meteor.absoluteUrl(),
    };
    const userEmail = user.emails[0].address;
    const to = doc.to !== undefined && doc.to !== '' && doc.to.length > 0 ? doc.to : userEmail;
    varsData.ambassador_email = userEmail;

    if (doc.screeningId !== undefined) {
      const screening = Screenings.findOne({ _id: doc.screeningId });
      screening.date_formated = moment(screening.date).format('DD/MM/YYYY hh:mm A');
      varsData.screening = screening;
      varsData.film = screening.film();
    }

    SSR.compileTemplate('subject', template.subject);
    const compiledSubject = SSR.render('subject', varsData);

    const pidgeon = {
      to,
      from: 'Taturana Mobilização Social<contato@taturanamobi.com.br>',
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
