// import { Meteor } from 'meteor/meteor';
import { Factory } from 'meteor/dburles:factory';
import faker from 'faker';
import { moment } from 'meteor/momentjs:moment';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
// import { Random } from 'meteor/random';
import _ from 'underscore';

// import { denodeify } from './utils/denodeify';
import Users from '../../models/users';
import Films from '../../models/films';
import Screenings from '../../models/screenings';
import NotificationTemplate from '../../models/notification_templates';

import {
  NOTIFICATION_TRIGGERS,
  FILM_STATUS,
  SCREENING_STATUS,
  SCREENING_ACTIVITY,
} from '../../models/schemas';

Factory.define('user', Users, {
  profile: {
    name: () => faker.name.findName(),
    cell_phone: () => faker.phone.phoneNumber(),
    city: () => faker.address.city(),
    uf: 'SP',
    institution: () => faker.lorem.sentence(),
    roles: [
      'admin',
    ],
  },
  emails: () => {
    const address = faker.internet.email();
    return [
      {
        address,
        verified: true,
      },
    ];
  },
});

Factory.define('film', Films, {
  title: () => faker.lorem.sentence(),
  poster_path: '/test/test.jpg',
  poster_home_path: '/test/test.jpg',
  link_for_download: 'https://taturanamobi.com.br',
  status: FILM_STATUS[0],
  synopsis: () => faker.lorem.paragraphs(),
  genre: 'Teste',
  year: '2018',
  duration: '120',
  country: 'Brasil',
  age_rating: '12',
  slug: () => faker.lorem.slug(),
  press_kit_path: '/test/test.jpg',
  createdAt: () => new Date(),
});

Factory.define('screening', Screenings, {
  filmId: () => Factory.get('film'),
  user_id: () => Factory.get('user'),
  place_name: () => faker.lorem.sentence(),
  street: () => faker.address.streetName(),
  number: () => faker.random.number({ max: 9999 }),
  city: () => faker.address.city(),
  uf: 'SP',
  date: moment().add(3, 'days').toDate(),
  activity: SCREENING_ACTIVITY[2],
  team_member: false,
  quorum_expectation: () => faker.random.number({ max: 999 }),
  comments: () => faker.lorem.sentences(),
  accept_terms: true,
  status: SCREENING_STATUS[0],
});

Factory.define('notificationTemplate', NotificationTemplate, {
  name: '',
  trigger: '',
  filmId: '',
  subject: () => faker.lorem.sentence(),
  body: () => faker.lorem.words(),
});

export const createBasicFakeData = () => {
  _.times(1, () => Factory.create('user'));
  // _.times(3, () => Factory.create('film'));
  // _.times(9, () => Factory.create('screening'));
  _.forEach(NOTIFICATION_TRIGGERS, (n) => Factory.create('notificationTemplate', { trigger: n, name: n }));
  // _.forEach(NOTIFICATION_TRIGGERS, n => Factory.create('notificationTemplate',
  // { trigger: n, name: n, filmId: Factory.get('film') }));
};

// export default { createBasicFakeData };
