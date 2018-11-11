/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
// import { Factory } from 'meteor/dburles:factory';
import { assert } from 'chai';
// import { Template } from 'meteor/templating';
// import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { withRenderedTemplate } from './../test-helpers.js';
// import Films from './../../api/films/films.js';

if (Meteor.isClient) {
  import './home.js';

  describe('UI_Page_Home', function () {
    it('renders correctly', function () {
      const data = [];
      withRenderedTemplate('home', data, (el) => {
        assert.equal($(el).find('#home').length, 1);
      });
    });
  });
}
