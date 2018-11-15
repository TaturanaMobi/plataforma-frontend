// Client entry point, imports all client code

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import Schemas from '../imports/api/schemas';
import Films from '../imports/api/films/films';
import Screenings from '../imports/api/screenings/screenings';
import '../imports/startup/client';
import '../imports/startup/both';

Template.registerHelper('Schemas', Schemas);
Template.registerHelper('Films', Films);
Template.registerHelper('Screenings', Screenings);

Meteor.subscribe('files.images.all');
