import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';

import './images';
import Schemas from './schemas';
import Screenings from './screenings';
import { Slug } from './states_and_cities';

const Films = new Mongo.Collection('films');

Films.helpers({
  screenings() {
    return Screenings.find({ filmId: this._id });
  },
});

Films.portfolio = () => Films.find({
  $or: [{
    status: 'Portfolio',
  }, {
    status: 'Difusão/Portfolio',
  }],
}, { sort: { sequence_number: 1 }, fields: { screening: 0 } });

Films.disseminate = () => Films.find({
  $or: [{
    status: 'Difusão',
  }, {
    status: 'Difusão/Portfolio',
  }],
}, { sort: { sequence_number: 1 }, fields: { screening: 0 } });

Films.all = function all(limit, id = 0) {
  return Films.find((id.length > 2 ? { _id: id } : {}), {
    sort: { sequence_number: 1 },
    fields: { screening: 0 },
    limit: (limit > 0 ? limit : 100),
  });
};

Films.active = () => Films.find(
  { status: { $not: /Oculto/ } },
  {
    sort: { sequence_number: 1 },
    fields: { screening: 0 },
  },
);

Films.count = () => Films.active().count();

Films.allow({
  insert(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
  update(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
});

Films.attachSchema(Schemas.Film);

if (Meteor.isServer) {
  Films.before.insert(function (userId, doc) {
    doc.slug = Slug(doc.title);

    return doc;
  });
  Films.before.update(function (userId, doc, fieldNames, modifier, options) {
    // console.log(userId, doc, fieldNames, modifier, options);
    modifier.$set = modifier.$set || {};
    if (typeof modifier.$set.title !== 'undefined') {
      modifier.$set.slug = Slug(modifier.$set.title);
    }

    return modifier;
  });
}

export default Films;
