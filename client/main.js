// Client entry point, imports all client code

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

import Schemas from '../imports/models/schemas';
import Films from '../imports/models/films';
import Users from '../imports/models/users';
import Screenings from '../imports/models/screenings';
import '../imports/startup/client';
import '../imports/startup/both';

Template.registerHelper('Schemas', Schemas);
Template.registerHelper('Films', Films);
Template.registerHelper('Screenings', Screenings);
Template.registerHelper('Users', Users);

Meteor.subscribe('files.images.all');
