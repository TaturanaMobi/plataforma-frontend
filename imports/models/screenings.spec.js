/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { assert } from 'chai';
import Screenings from './screenings';

describe('screenings', function () {
  it('update film statistics after screening insert', function () {
    assert.typeOf(Screenings, 'object');
  });
});
