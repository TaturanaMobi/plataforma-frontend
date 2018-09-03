import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

if (Meteor.isClient) {

  Template.admReports.helpers({
    reports() {
      const reports = _.filter(this.screening, function (screening) { return 'report_description' in screening; });

      return reports;
    },
  });
}
