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


// Films.friendlySlugs({
//   slugFrom: 'title',
//   slugField: 'slug',
//   distinct: true,
//   updateSlug: true,
// });

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

// Films.by_user_id = () => {
//   const films = Films.find({
//     status: { $not: /Oculto/ },
//     'screening.user_id': Meteor.userId(),
//   }).fetch();
//   return films;
// };

// Films.screenings_by_user_id = () => {
//   const userId = Meteor.userId();
//   const films = Films.by_user_id(userId);
//   const userScreenings = [];

//   for (let a = 0; a < films.length; a += 1) {
//     const fScr = films[a].screening;
//     for (let i = 0; i < fScr.length; i += 1) {
//       if (fScr[i].user_id === userId) {
//         fScr[i].title = films[a].title;
//         fScr[i].film_id = films[a]._id;
//         fScr[i].film_press_kit = films[a].press_kit_path;
//         userScreenings.push(fScr[i]);
//       }
//     }
//   }
//   return userScreenings;
// };

// Films.by_screening_id = screeningId => Films.findOne({
//   status: { $not: /Oculto/ },
//   'screening._id': screeningId,
// });

// Films.return_film_and_screening = (screeningId) => {
//   const film = Films.by_screening_id(screeningId);
//   const screening = Films.return_screening(screeningId);
//   return {
//     film,
//     screening,
//   };
// };

// Films.return_screening = (screeningId) => {
//   const film = Films.by_screening_id(screeningId);
//   let screening;
//   for (let i = 0; i < film.screening.length; i += 1) {
//     if (film.screening[i]._id === screeningId) {
//       screening = film.screening[i];
//     }
//   }
//   return screening;
// };

Films.get_image_by_src = (id, src) => {
  const film = Films.findOne(id);
  let image;

  _.each(film.slideshow, (img) => {
    if (img.src === src) {
      image = img;
    }
  });

  return image;
};

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
