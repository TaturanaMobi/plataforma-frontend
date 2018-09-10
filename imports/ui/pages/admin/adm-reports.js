import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

Template.admReports.helpers({
  reports() {
    const reports = _.filter(this.screening, screening => 'report_description' in screening);

    return reports;
  },
});
