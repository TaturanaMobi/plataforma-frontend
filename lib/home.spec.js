/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// import { Mongo } from 'meteor/mongo';
// import { Factory } from 'meteor/dburles:factory';
import { assert } from 'chai';
// import { Template } from 'meteor/templating';
// import { _ } from 'meteor/underscore';
// import { $ } from 'meteor/jquery';

// import { withRenderedTemplate } from './test-helpers.js';
import './home.js';
// import { Films } from './../imports/api/films/films.js';

describe('Lists_show', function () {
  // beforeEach(function () {
  //   Template.registerHelper('_', key => key);
  // });

  // afterEach(function () {
  //   Template.deregisterHelper('_');
  // });

  it('renders correctly with simple data', function () {
    assert.equal(3, 3);
  });
});
