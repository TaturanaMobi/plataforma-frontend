import { Template } from 'meteor/templating';
import { Router } from 'meteor/iron:router';
import { $ } from 'meteor/jquery';

import './adm-films-report.html';
import Screenings from '../../../models/screenings.js';


Template.admFilmsReport.helpers({
  screenings() {
    const result = Screenings.find();
    return result;
  }
});
