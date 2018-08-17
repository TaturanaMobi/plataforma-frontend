import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

if (Meteor.isClient) {

  Template.admReports.helpers({
    reports: function () {
      var reports = _.filter(this.screening, function(screening) { return 'report_description' in screening })

      return reports;
    },
  });
}
