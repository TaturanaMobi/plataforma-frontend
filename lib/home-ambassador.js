import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Films } from './../imports/api/films/films.js';
import { _ } from 'meteor/underscore';

if (Meteor.isClient) {
  Template.ambassador.helpers({
    disseminate() {
      return Films.disseminate();
    },
    session_status_icon(screening) {
      // Rascunho
      if (screening.draft) {
        return 'edit';
      }

      // Agendada
      const today = new Date();

      if (today.getTime() < screening.date.getTime()) {
        return 'calendar';
      }

      // Completo
      if (_.has(screening, 'report_description')) {
        return 'complete';
      }

      // Falta relatório
      return 'report-pending';
    },
    in_future(screening) {
      const today = new Date();

      return (today.getTime() < screening.date.getTime() || screening.draft == 'admin-draft');
    },
    is_report_pending(screening) {
      return !_.has(screening, 'report_description');
    },
  });
  Template.ambassador.events({
    'click .destroy'() {
      Meteor.call('removeScreening', this._id);
    },
  });
}
