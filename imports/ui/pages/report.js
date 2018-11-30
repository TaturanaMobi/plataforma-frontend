import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Router } from 'meteor/iron:router';
import './report.html';

Template.report.events({
  'submit #report'(event) {
    event.preventDefault();
    const screening = this.screening;
    const items = ['real_quorum', 'report_description', 'report_image_1', 'report_image_2', 'report_image_3', 'author_1', 'author_2', 'author_3'];

    const report = {
      // real_quorum: event.target.real_quorum.value,
      // report_description: event.target.report_description.value,
      // report_image_1: Session.get('report_image_1'),
      // report_image_2: Session.get('report_image_2'),
      // report_image_3: Session.get('report_image_3'),
      // author_1: event.target.author_1.value,
      // author_2: event.target.author_2.value,
      // author_3: event.target.author_3.value,
    };

    for (let i = 0; i < items.length; i += 1) {
      if (report[items[i]] !== undefined) {
        screening[items[i]] = report[items[i]];
      }
    }

    Meteor.call('updateScreening', screening, (error) => {
      if (!error) {
        FlashMessages.sendSuccess('Relatório enviado com sucesso!');
        Router.go('ambassador');
      } else {
        FlashMessages.sendError('Erro encontrado ao enviar relatório. Tente novamente mais tarde.');
      }
    });
  },
});

Template.report.helpers({
  reportImage1() {
    return {
      file_type: 'report_image_1',
    };
  },
  reportImage2() {
    return {
      file_type: 'report_image_2',
    };
  },
  reportImage3() {
    return {
      file_type: 'report_image_3',
    };
  },

});
