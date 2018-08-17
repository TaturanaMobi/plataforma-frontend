/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Factory } from 'meteor/dburles:factory';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
// import { Random } from 'meteor/random';
// import { _ } from 'meteor/underscore';
// import { Todos } from '../todos.js';
// import './publications.js';

describe('todos', function () {
  describe('mutators', function () {
    it('builds correctly from factory', function () {
      const todo = Factory.create('todo');
      assert.typeOf(todo, 'object');
      assert.typeOf(todo.createdAt, 'date');
    });
  });
  it('leaves createdAt on update', function () {
    const createdAt = new Date(new Date() - 1000);
    let todo = Factory.create('todo', { createdAt });
    const text = 'some new text';
    Todos.update(todo, { $set: { text } });
    todo = Todos.findOne(todo._id);
    assert.equal(todo.text, text);
    assert.equal(todo.createdAt.getTime(), createdAt.getTime());
  });
});
