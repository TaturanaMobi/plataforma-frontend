/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

// import { Factory } from 'meteor/dburles:factory';
// import { PublicationCollector } from 'meteor/johanbrook:publication-collector';
import { assert } from 'chai';
// import { Random } from 'meteor/random';
// import _ from 'underscore';
import Films from './films.js';
// import './publications.js';

describe('films', function () {
  it('load correct from db', function () {
    assert.typeOf(Films, 'object');
    // assert.typeOf(Films[0].get(), 'date');
  });
  // it('leaves createdAt on update', function () {
  //   const createdAt = new Date(new Date() - 1000);
  //   let films = Factory.create('films', { createdAt });
  //   const text = 'some new text';
  //   Films.update(films, { $set: { text } });
  //   films = Films.findOne(films._id);
  //   assert.equal(films.text, text);
  //   assert.equal(films.createdAt.getTime(), createdAt.getTime());
  // });
});
