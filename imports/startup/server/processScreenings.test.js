/* eslint-env mocha */
// import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
import { moment } from 'meteor/momentjs:moment';
import _ from 'underscore';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import { Random } from 'meteor/random';

import Screenings from '../../models/screenings';
import Notifications from '../../models/notifications';
import processScreenings from './processScreenings';
import * as testHelpers from '../both/test-helpers';

describe('process screenings', () => {
  beforeEach(() => {
    resetDatabase();
    const userId = Random.fraction();
    _.times(3, () => testHelpers.createBasicFakeData(userId));
  });

  it('screening date is 10 or more days away', async () => {
    const elevenDaysAfter = moment().add(12, 'days');
    const tenDaysAfter = moment().add(215, 'hours');
    const nineDaysAfter = moment().add(9, 'days');

    assert.throws(() => {
      processScreenings.isGreaterThan10days('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isGreaterThan10days(moment());
    }, 'Expected Date');
    assert.ok(processScreenings.isGreaterThan10days(elevenDaysAfter.toDate()));
    assert.isNotOk(processScreenings.isGreaterThan10days(tenDaysAfter.toDate()));
    assert.isNotOk(processScreenings.isGreaterThan10days(nineDaysAfter.toDate()));
  });

  it('screening date is between 9 and 3 days away', async () => {
    const tenDaysBefore = moment().add(10, 'days').add(1, 'seconds');
    const nineDaysBefore = moment().add(9, 'days').subtract(1, 'seconds');
    const eightDaysBefore = moment().add(8, 'days');
    const sevenDaysBefore = moment().add(7, 'days');
    const sixDaysBefore = moment().add(6, 'days');
    const fiveDaysBefore = moment().add(5, 'days');
    const fourDaysBefore = moment().add(4, 'days').add(1, 'seconds');
    const threeDaysBefore = moment().add(3, 'days');
    const twoDaysBefore = moment().add(2, 'days');

    assert.throws(() => {
      processScreenings.isBetween9and3days('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.isBetween9and3days(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.isBetween9and3days(tenDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(nineDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(eightDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(sevenDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(sixDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(fiveDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(fourDaysBefore.toDate()));
    assert.ok(processScreenings.isBetween9and3days(threeDaysBefore.toDate()));
    assert.isNotOk(processScreenings.isBetween9and3days(twoDaysBefore.toDate()));
  });

  it('screening date is 3 or less days away', async () => {
    const fourDaysBefore = moment().add(4, 'days').add(1, 'seconds');
    const threeDaysBefore = moment().add(3, 'days').subtract(1, 'seconds');
    const twoDaysBefore = moment().add(2, 'days');
    const oneDaysBefore = moment().add(1, 'days');

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
    const elevenDaysBefore = moment().add(11, 'days');
    const tenDaysBefore = moment().add(10, 'days').subtract(1, 'seconds');
    const threeDaysBefore = moment().add(3, 'days');

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
    const eightDaysBefore = moment().add(8, 'days');
    const sevenDaysBefore = moment().add(7, 'days').subtract(1, 'seconds');
    const sixDaysBefore = moment().add(6, 'days');

    assert.throws(() => {
      processScreenings.is7daysBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.is7daysBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.is7daysBefore(eightDaysBefore.toDate()));
    assert.ok(processScreenings.is7daysBefore(sevenDaysBefore.toDate()));
    assert.ok(processScreenings.is7daysBefore(sixDaysBefore.toDate()));
  });

  it('screening date is 2 days away', async () => {
    const threeDaysBefore = moment().add(3, 'days').add(1, 'seconds');
    const twoDaysBefore = moment().add(2, 'days');
    const oneDaysBefore = moment().add(1, 'days');

    assert.throws(() => {
      processScreenings.is2daysBefore('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.is2daysBefore(moment());
    }, 'Expected Date');
    assert.isNotOk(processScreenings.is2daysBefore(threeDaysBefore.toDate()));
    assert.ok(processScreenings.is2daysBefore(twoDaysBefore.toDate()));
    assert.ok(processScreenings.is2daysBefore(oneDaysBefore.toDate()));
  });

  it('screening date is 1 day away', async () => {
    const threeDaysBefore = moment().add(3, 'days');
    const twoDaysBefore = moment().add(2, 'days').add(1, 'seconds');
    const oneDaysBefore = moment().add(1, 'days');

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

  it('screening date was 24h ago', async () => {
    const threeDaysAfter = moment().subtract(3, 'days');
    const twoDaysAfter = moment().subtract(2, 'days');
    const fortyHoursAfter = moment().subtract(40, 'hours');
    const twelveHoursAfter = moment().subtract(12, 'hours');

    assert.throws(() => {
      processScreenings.was24hoursAgo('');
    }, 'Expected Date');
    assert.throws(() => {
      processScreenings.was24hoursAgo(moment());
    }, 'Expected Date');
    assert.ok(processScreenings.was24hoursAgo(threeDaysAfter.toDate()));
    assert.ok(processScreenings.was24hoursAgo(twoDaysAfter.toDate()));
    assert.ok(processScreenings.was24hoursAgo(fortyHoursAfter.toDate()));
    assert.isNotOk(processScreenings.was24hoursAgo(twelveHoursAfter.toDate()));
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
  // const s = Screenings.findOne({});

  // Screenings.find({}).map(doc => console.log(doc));
  // assert.ok(processScreenings.loadData(fourMonthsBefore.toDate()));

  // });

  // it('update screening with status', async () => {

  // });

  xit('process screening with status agendada', async () => {
    Screenings.find({ status: 'Agendada' }).map((doc) => processScreenings.processAgendada(doc));
    assert.ok(Notifications.find({}).count() === 27);
  });

  // it('process screening with status confirmada', async () => {

  // });


  // it('process screening with status pendente', async () => {

  // });

  // it('process screening with status concluída', async () => {

  // });

  // it('process screening with status cancelada', async () => {

  // });
});
