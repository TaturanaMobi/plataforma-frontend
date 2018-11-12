// Client entry point, imports all client code

import { Template } from 'meteor/templating';
// import { AutoForm } from 'meteor/aldeed:autoform';

import Schemas from '../imports/api/schemas';
import Films from '../imports/api/films/films';
import Screenings from '../imports/api/screenings/screenings';
import '../imports/startup/client';
import '../imports/startup/both';

Template.registerHelper('Schemas', Schemas);
Template.registerHelper('Films', Films);
Template.registerHelper('Screenings', Screenings);

// AutoForm.setDefaultTemplate('plain');
