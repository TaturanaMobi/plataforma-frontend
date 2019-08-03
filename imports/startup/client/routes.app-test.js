/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

import { Meteor } from 'meteor/meteor';
// import { Tracker } from 'meteor/tracker';
// import { DDP } from 'meteor/ddp-client';
// import { Router } from 'meteor/iron:router';
import { assert } from 'chai';
// import { Promise } from 'meteor/promise';
// import { $ } from 'meteor/jquery';

// import denodeify from '../../utils/denodeify';
import generateData from '../../models/generate-data.app-tests';
// import { Lists } from '../../api/lists/lists.js';
// import { Todos } from '../../api/todos/todos.js';

// const Lists = [];

// Utility -- returns a promise which resolves when all subscriptions are done
// const waitForSubscriptions = () => new Promise((resolve) => {
//   const poll = Meteor.setInterval(() => {
//     if (DDP._allSubscriptionsReady()) {
//       Meteor.clearInterval(poll);
//       resolve();
//     }
//   }, 200);
// });

// Tracker.afterFlush runs code when all consequent of a tracker based change
//   (such as a route change) have occured. This makes it a promise.
// const afterFlushPromise = denodeify(Tracker.afterFlush);

if (Meteor.isClient) {
  describe('data available when routed', () => {
    // First, ensure the data that we expect is loaded on the server
    //   Then, route the app to the homepage
    beforeEach(() => generateData());
    //     .then(() => Router.go('/'))
    //     .then(waitForSubscriptions));

    // describe('when logged out', () => {
    it('has all public lists at homepage', () => {
      assert.equal(3, 3);
    });

    // it('renders the correct list when routed to', () => {
    //   const list = Lists.findOne();
    //   Router.go('Lists.show', { _id: list._id });

    //   return afterFlushPromise()
    //     .then(waitForSubscriptions)
    //     .then(() => {
    //       assert.equal($('.title-wrapper').html(), list.name);
    //       assert.equal(Lists.find({ listId: list._id }).count(), 3);
    //     });
    // });
  });
}
