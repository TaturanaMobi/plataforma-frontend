// This file will be auto-imported in the app-test context, ensuring the method is always available

import { Meteor } from 'meteor/meteor';
// import { Factory } from 'meteor/dburles:factory';
// import faker from 'faker';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';

import { denodeify } from './utils/denodeify';
import * as testHelpers from '../startup/both/test-helpers';

Meteor.methods({
  generateFixtures() {
    resetDatabase();

    _.times(3, () => testHelpers.createBasicFakeData(Random._id));
  },
});

// if (Meteor.isClient) {
// Create a second connection to the server to use to call test data methods
// We do this so there's no contention w/ the currently tested user's connection
const testConnection = Meteor.connect(Meteor.absoluteUrl());

const generateData = denodeify((cb) => {
  testConnection.call('generateFixtures', cb);
});

export default generateData;
// }
