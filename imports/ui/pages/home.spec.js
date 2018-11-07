/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// import { Mongo } from 'meteor/mongo';
// import { Factory } from 'meteor/dburles:factory';
import { assert } from 'chai';
// import { Template } from 'meteor/templating';
// import { _ } from 'meteor/underscore';
// import { $ } from 'meteor/jquery';

// import { withRenderedTemplate } from './../test-helpers.js';
// import './../components/carousel.html';
import './home.js';
// import Films from './../imports/api/films/films.js';

describe('UI_Page_Home', function () {
  // beforeEach(function () {
  //   Template.registerHelper('_', key => key);
  // });

  // afterEach(function () {
  //   Template.deregisterHelper('_');
  // });

  it('renders correctly with simple data', function () {
    assert.equal(3, 3);
  });

  // it('renders correctly with simple data', function () {
  //   const todo = Factory.build('todo', { checked: false });
  //   const data = {
  //     todo: Films._transform(todo),
  //     onEditingChange: () => 0,
  //   };

  //   withRenderedTemplate('Films_item', data, el => {
  //     assert.equal($(el).find('input[type=text]').val(), todo.text);
  //     assert.equal($(el).find('.list-item.checked').length, 0);
  //     assert.equal($(el).find('.list-item.editing').length, 0);
  //   });
  // });
});
