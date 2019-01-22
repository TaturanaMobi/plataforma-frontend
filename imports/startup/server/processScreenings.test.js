/* eslint-env mocha */
// import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { moment } from 'meteor/momentjs:moment';
import { _ } from 'meteor/underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';

import processScreenings from './processScreenings';
import * as testHelpers from '../both/test-helpers';

describe('process screenings', () => {
  beforeEach(() => {
    resetDatabase();
    const userId = Random.fraction();
    _.times(3, () => testHelpers.createBasicFakeData(userId));
  });

  it('screening date is 10 or more days away', async () => {
    const elevenDaysBefore = moment().subtract(11, 'days');
    const tenDaysBefore = moment().subtract(10, 'days');
    const nineDaysBefore = moment().subtract(9, 'days');

    assert.throws(() => {
      processScreenings.isGreaterThan10days('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isGreaterThan10days(moment());
    }, 'Expected Date');
    assert.ok(processScreenings.isGreaterThan10days(elevenDaysBefore.toDate()));
    assert.ok(processScreenings.isGreaterThan10days(tenDaysBefore.toDate()));
    assert.isNotOk(processScreenings.isGreaterThan10days(nineDaysBefore.toDate()));
  });

  it('screening date is between 9 and 4 days away', async () => {
    const tenDaysBefore = moment().subtract(10, 'days');
    const nineDaysBefore = moment().subtract(9, 'days').add(1, 'second');
    const eightDaysBefore = moment().subtract(8, 'days');
    const sevenDaysBefore = moment().subtract(7, 'days');
    const sixDaysBefore = moment().subtract(6, 'days');
    const fiveDaysBefore = moment().subtract(5, 'days');
    const fourDaysBefore = moment().subtract(4, 'days');
    const threeDaysBefore = moment().subtract(3, 'days');

    assert.throws(() => {
      processScreenings.isBetween9and4days('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isBetween9and4days(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.isBetween9and4days(tenDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(nineDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(eightDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(sevenDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(sixDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(fiveDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and4days(fourDaysBefore.toDate()));
    assert.isNotOk(processScreenings.isBetween9and4days(threeDaysBefore.toDate()));
  });

  it('screening date is 3 or less days away', async () => {
    const fourDaysBefore = moment().subtract(4, 'days');
    const threeDaysBefore = moment().subtract(3, 'days');
    const twoDaysBefore = moment().subtract(2, 'days');
    const oneDaysBefore = moment().subtract(1, 'days');

    assert.throws(() => {
      processScreenings.isLowerThan3days('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isLowerThan3days(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.isLowerThan3days(fourDaysBefore.toDate()));
    assert.ok(processScreenings.isLowerThan3days(threeDaysBefore.toDate()));
    assert.ok(processScreenings.isLowerThan3days(twoDaysBefore.toDate()));
    assert.ok(processScreenings.isLowerThan3days(oneDaysBefore.toDate()));
  });

  it('screening date is exact 10 days away', async () => {
    const elevenDaysBefore = moment().subtract(11, 'days');
    const tenDaysBefore = moment().subtract(10, 'days');
    const threeDaysBefore = moment().subtract(3, 'days');

    assert.throws(() => {
      processScreenings.isAt10thDayBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isAt10thDayBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.isAt10thDayBefore(elevenDaysBefore.toDate()));
    assert.ok(processScreenings.isAt10thDayBefore(tenDaysBefore.toDate()));
    assert.isNotOk(processScreenings.isAt10thDayBefore(threeDaysBefore.toDate()));
  });

  it('screening date is 7 days away', async () => {
    const eightDaysBefore = moment().subtract(8, 'days');
    const sevenDaysBefore = moment().subtract(7, 'days');
    const sixDaysBefore = moment().subtract(6, 'days');

    assert.throws(() => {
      processScreenings.is7daysBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.is7daysBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.is7daysBefore(eightDaysBefore.toDate()));
    assert.ok(processScreenings.is7daysBefore(sevenDaysBefore.toDate()));
    assert.isNotOk(processScreenings.is7daysBefore(sixDaysBefore.toDate()));
  });

  it('screening date is 2 days away', async () => {
    const threeDaysBefore = moment().subtract(3, 'days');
    const twoDaysBefore = moment().subtract(2, 'days');
    const oneDaysBefore = moment().subtract(1, 'days');

    assert.throws(() => {
      processScreenings.is2daysBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.is2daysBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.is2daysBefore(threeDaysBefore.toDate()));
    assert.ok(processScreenings.is2daysBefore(twoDaysBefore.toDate()));
    assert.isNotOk(processScreenings.is2daysBefore(oneDaysBefore.toDate()));
  });

  it('screening date is 1 day away', async () => {
    const threeDaysBefore = moment().subtract(3, 'days');
    const twoDaysBefore = moment().subtract(2, 'days');
    const oneDaysBefore = moment().subtract(1, 'days');

    assert.throws(() => {
      processScreenings.is1dayBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.is1dayBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.is1dayBefore(threeDaysBefore.toDate()));
    assert.isNotOk(processScreenings.is1dayBefore(twoDaysBefore.toDate()));
    assert.ok(processScreenings.is1dayBefore(oneDaysBefore.toDate()));
  });

  it('screening date was 40h ago', async () => {
    const threeDaysAfter = moment().subtract(3, 'days');
    const twoDaysAfter = moment().subtract(2, 'days');
    const fortyHoursAfter = moment().subtract(40, 'hours');
    const twelveHoursAfter = moment().subtract(12, 'hours');

    assert.throws(() => {
      processScreenings.was40hoursAgo('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.was40hoursAgo(moment());
    }, 'Expected Date');
    assert.ok(processScreenings.was40hoursAgo(threeDaysAfter.toDate()));
    assert.ok(processScreenings.was40hoursAgo(twoDaysAfter.toDate()));
    assert.ok(processScreenings.was40hoursAgo(fortyHoursAfter.toDate()));
    assert.isNotOk(processScreenings.was40hoursAgo(twelveHoursAfter.toDate()));
  });

  it('screening date was 1 week ago', async () => {
    const sixDaysBefore = moment().subtract(6, 'days');
    const sevenDaysBefore = moment().subtract(7, 'days');
    const twelveDaysBefore = moment().subtract(12, 'days');

    assert.throws(() => {
      processScreenings.was1weekAgo('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.was1weekAgo(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.was1weekAgo(sixDaysBefore.toDate()));
    assert.ok(processScreenings.was1weekAgo(sevenDaysBefore.toDate()));
    assert.ok(processScreenings.was1weekAgo(twelveDaysBefore.toDate()));
  });

  it('screening date was 3 months ago', async () => {
    const fourMonthsBefore = moment().subtract(4, 'months');
    const threeMonthsBefore = moment().subtract(3, 'months');
    const twoMonthsBefore = moment().subtract(2, 'months');

    assert.throws(() => {
      processScreenings.was3monthsAgo('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.was3monthsAgo(moment());
    }, 'Expected Date');
    assert.ok(processScreenings.was3monthsAgo(fourMonthsBefore.toDate()));
    assert.ok(processScreenings.was3monthsAgo(threeMonthsBefore.toDate()));
    assert.isNotOk(processScreenings.was3monthsAgo(twoMonthsBefore.toDate()));
  });

  // it('create notification', async () => {
  //   // const n = new Notification


  //   // assert.ok(processScreenings.createNotification({}, 111));
  // });

  // it('create notification with template by film', async () => {

  // });

  // it('load screening related data: film, user', async () => {

  // });

  // it('update screening with status', async () => {

  // });

  // it('process screening with status agendada', async () => {

  // });

  // it('process screening with status confirmada', async () => {

  // });


  // it('process screening with status pendente', async () => {

  // });

  // it('process screening with status concluída', async () => {

  // });

  // it('process screening with status cancelada', async () => {

  // });
});
