import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import { Template } from 'meteor/templating';

import { FilmScreeningInventory } from './../../../lib/film-screening-inventory';

function getFileBlob(url, cb) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.addEventListener('load', () => {
    cb(xhr.response);
  });
  xhr.send();
}

function blobToFile(blob, name) {
  blob.lastModifiedDate = new Date();
  blob.name = name;
  return blob;
}

function getFileObject(filePathOrUrl, cb) {
  getFileBlob(filePathOrUrl, (blob) => {
    cb(blobToFile(blob, 'test.jpg'));
  });
}

// Inventory functions
function incrementOrCreate(obj, key, increment) {
  increment = increment || 1;

  obj[key] = (key in obj) ? (obj[key] + increment) : increment;
  return obj;
}

function getMonthName(month) {
  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
  ];

  return monthNames[month];
}

function getZoneByState(state) {
  const zones = {
    Sudeste: ['SP', 'ES', 'MG', 'RG'],
    Sul: ['PR', 'SC', 'RS'],
    'Centro-Oeste': ['DF', 'GO', 'MS', 'MT'],
    Nordeste: ['BA', 'AL', 'CE', 'MA', 'PB', 'PE', 'PI', 'RN', 'SE'],
    Norte: ['AM', 'PA', 'RO', 'RR', 'AC', 'AP', 'TO'],
  };

  _.each(zones, (states, zone) => {
    if (states.indexOf(state) > 0) {
      return zone;
    }
  });
}

export const Films = new Mongo.Collection('films');

Films.friendlySlugs({
  slugFrom: 'title',
  slugField: 'slug',
  distinct: true,
  updateSlug: true,
});

Films.portfolio = () => Films.find({
  status: 'Portfolio',
});

Films.disseminate = () => Films.find({
  $or: [{
    status: 'Difusão',
  }, {
    status: 'Difusão/Portfolio',
  }],
}).fetch();

Films.all = () => Films.find({}, {
  sort: {
    sequence_number: 1,
  },
});

Films.active = () => Films.find({
  status: { $not: /Oculto/ } }, {
  sort: {
    sequence_number: 1,
  },
});

Films.count = () => Films.active().count();

Films.by_user_id = () => {
  const films = Films.find({
    status: { $not: /Oculto/ },
    'screening.user_id': Meteor.userId(),
  }).fetch();
  return films;
};

Films.screenings_by_user_id = () => {
  const user_id = Meteor.userId();
  const films = Films.by_user_id(user_id);
  const user_screenings = [];

  for (let a = 0; a < films.length; a += 1) {
    const f_scr = films[a].screening;
    for (let i = 0; i < f_scr.length; i += 1) {
      if (f_scr[i].user_id === user_id) {
        f_scr[i].title = films[a].title;
        f_scr[i].film_id = films[a]._id;
        f_scr[i].film_press_kit = films[a].press_kit_path;
        user_screenings.push(f_scr[i]);
      }
    }
  }
  return user_screenings;
};

Films.by_screening_id = screening_id => Films.findOne({
  status: { $not: /Oculto/ },
  'screening._id': screening_id,
});

Films.return_film_and_screening = (screening_id) => {
  const film = Films.by_screening_id(screening_id);
  const screening = Films.return_screening(screening_id);
  return {
    film,
    screening,
  };
};

Films.return_screening = (screening_id) => {
  const film = Films.by_screening_id(screening_id);
  let screening;
  for (let i = 0; i < film.screening.length; i += 1) {
    if (film.screening[i]._id === screening_id) {
      screening = film.screening[i];
    }
  }
  return screening;
};

Films.get_image_by_src = (id, src) => {
  const film = Films.findOne(id);
  let image;

  _.each(film.slideshow, (img) => {
    if (img.src == src) {
      image = img;
    }
  });

  return image;
};

Films.inventory = function inventoryFilm(film) {
  const legacyData = FilmScreeningInventory[film.title];
  const screenings = film.screening || [];
  const initialInventory = {
    viewers: 0,
    viewers_from_reports: 0,
    viewers_per_month: {},
    legacy_viewers: 0,
    sessions: 0,
    sessions_with_reports: 0,
    scheduled_sessions: 0,
    states: [],
    cities: [],
    cities_total: 0,
    categories: {},
    subcategories: {},
    viewers_zones: {},
    past_sessions: 0,
    future_sessions: 0,
    film,
  };

  const inventory = $.extend({}, initialInventory, legacyData);

  if (legacyData) {
    inventory.legacy_viewers = legacyData.viewers;
  }

  const now = new Date();
  const states = [];
  const cities = [];
  const users = [];

  inventory.scheduled_sessions += screenings.length;

  // const scr_id_real = [];
  _.each(screenings, (screening) => {
    // sessões - Sessões que não são rascunho
    let real_quorum = ('real_quorum' in screening) ? screening.real_quorum.replace(/[^0-9]/g, '') || 0 : 0;
    real_quorum = parseInt(real_quorum);

    if (!('draft' in screening) || ('draft' in screening && screening.draft == false)) {
      // sessoes jah exibidas
      if (screening.date < now) {
        inventory.past_sessions += 1;
        // sessões com relatorio que ja foram exibidas
        if (screening.report_description) {
          inventory.viewers_from_reports = parseInt(inventory.viewers_from_reports) + real_quorum;
          inventory.sessions_with_reports = parseInt(inventory.sessions_with_reports) + 1;
        }
      } else {
        // sessoes a serem exibidas
        inventory.future_sessions += 1;
      }

      inventory.sessions += 1;
      // Espectadores por mês

      if (real_quorum > 0) {
        // real_quorum = parseInt(real_quorum);
        inventory.viewers += real_quorum;
        incrementOrCreate(
          inventory.viewers_per_month,
          getMonthName(screening.date.getMonth()), real_quorum
        );
      }

      // Estados e viewers por area
      if ('uf' in screening) {
        states.push(screening.uf);
        if (getZoneByState(screening.uf)) {
          incrementOrCreate(inventory.viewers_zones, getZoneByState(screening.uf));
        }
      }

      // quais cidades
      cities.push(screening.city);

      // Usuários
      if (screening.user_id) {
        users.push(Meteor.users.findOne(screening.user_id));
      }
    }
  });

  if (users.length > 0) {
    _.each(users, (user) => {
      // Categorias e subcategorias dos embaixadores?
      if (user && user.profile && user.profile.name !== 'admin') {
        incrementOrCreate(inventory.categories, user.profile.category);
        incrementOrCreate(inventory.subcategories, user.profile.subcategory);
      }
    });
  }
  inventory.cities_total += _.uniq(cities).length;
  inventory.states = _.uniq(states.concat(inventory.states));
  // Não retorna inventorio sem sessões
  if (inventory.sessions > 0) {
    return inventory;
  }
};

Films.allow({
  insert(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
});

if (Meteor.isClient) {
  Meteor.subscribe('films');
  Template.films.helpers({
    films() {
      return Films.active();
    },
  });
}
