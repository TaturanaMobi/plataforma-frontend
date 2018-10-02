import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';
import SimpleSchema from 'simpl-schema';

import { FilmScreeningInventory } from './film-screening-inventory';

const Films = new Mongo.Collection('films');

Films.schema = new SimpleSchema({
  title: {
    type: String,
    label: 'Título original*',
    max: 30,
    optional: false
  },
  title_pt: {
    type: String,
    label: 'Título em português',
    max: 30,
    optional: true
  },
  trailer_url: {
    type: String,
    label: 'Url do Trailer',
    max: 30,
    optional: true
  },
  genre: {
    type: String,
    label: 'Gênero*',
    optional: false
  },
  year: {
    type: String,
    label: 'Ano*',
    max: 4,
    optional: false
  },
  length: {
    type: String,
    label: 'Duração*',
    max: 10,
    optional: false
  },
  country: {
    type: String,
    label: 'País*',
    max: 30,
    optional: false
  },
  distributor: {
    type: String,
    label: 'Distribuidor*',
    max: 50,
    optional: false
  },
  editor: {
    type: String,
    label: 'Editor*',
    max: 50,
    optional: false
  },
  producer: {
    type: String,
    label: 'Produtor*',
    max: 50,
    optional: false
  },
  coproducer: {
    type: String,
    label: 'Co-Produtor*',
    max: 50,
    optional: false
  },
  associate_producer: {
    type: String,
    label: 'Produtora Associada',
    max: 50,
    optional: true
  },
  executive_producer: {
    type: String,
    label: 'Produção Executiva',
    max: 50,
    optional: true
  },
  soundtrack: {
    type: String,
    label: 'Trilha*',
    max: 50,
    optional: false
  },
  createdAt: {
    type: Date,
    optional: false
  },
  synopsis: {
    type: String,
    label: 'Sinopse*',
    max: 400,
    optional: false
  },
  poster_path: {
    type: String,
    label: 'Poster',
    max: 30,
  },
  poster_home_path: {
    type: String,
    label: 'Poster para a home',
    max: 30,
  },
  poster_slice_path: {
    type: String,
    label: 'Poster cortado para a home',
    max: 30,
  },
  poster_thumb_path: {
    type: String,
    label: 'Poster thumbnail',
    max: 30,
  },
  press_kit_path: {
    type: String,
    label: 'Press kit',
    max: 30,
  },
  technical_information: {
    type: String,
    label: 'Informações técnicas',
    max: 400,
    optional: true
  },
  site: {
    type: String,
    label: 'Site',
    max: 30,
    optional: true
  },
  facebook: {
    type: String,
    label: 'Facebook',
    max: 30,
    optional: true
  },
  twitter: {
    type: String,
    label: 'Twitter',
    max: 30,
    optional: true
  },
  instagram: {
    type: String,
    label: 'Instagram',
    max: 30,
    optional: true
  },
  youtube: {
    type: String,
    label: 'YouTube',
    max: 30,
    optional: true
  }
}, {tracker: Tracker});

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
    return null;
  });
}

// Films.friendlySlugs({
//   slugFrom: 'title',
//   slugField: 'slug',
//   distinct: true,
//   updateSlug: true,
// });

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
  const userId = Meteor.userId();
  const films = Films.by_user_id(userId);
  const userScreenings = [];

  for (let a = 0; a < films.length; a += 1) {
    const fScr = films[a].screening;
    for (let i = 0; i < fScr.length; i += 1) {
      if (fScr[i].user_id === userId) {
        fScr[i].title = films[a].title;
        fScr[i].film_id = films[a]._id;
        fScr[i].film_press_kit = films[a].press_kit_path;
        userScreenings.push(fScr[i]);
      }
    }
  }
  return userScreenings;
};

Films.by_screening_id = screeningId => Films.findOne({
  status: { $not: /Oculto/ },
  'screening._id': screeningId,
});

Films.return_film_and_screening = (screeningId) => {
  const film = Films.by_screening_id(screeningId);
  const screening = Films.return_screening(screeningId);
  return {
    film,
    screening,
  };
};

Films.return_screening = (screeningId) => {
  const film = Films.by_screening_id(screeningId);
  let screening;
  for (let i = 0; i < film.screening.length; i += 1) {
    if (film.screening[i]._id === screeningId) {
      screening = film.screening[i];
    }
  }
  return screening;
};

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

Films.inventory = (film) => {
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
    let realQuorum = ('realQuorum' in screening) ? screening.realQuorum.replace(/[^0-9]/g, '') || 0 : 0;
    realQuorum = parseInt(realQuorum, 10);

    if (!('draft' in screening) || ('draft' in screening && screening.draft === false)) {
      // sessoes jah exibidas
      if (screening.date < now) {
        inventory.past_sessions += 1;
        // sessões com relatorio que ja foram exibidas
        if (screening.report_description) {
          inventory.viewers_from_reports = parseInt(
            inventory.viewers_from_reports, 10
          ) + realQuorum;
          inventory.sessions_with_reports = parseInt(
            inventory.sessions_with_reports, 10
          ) + 1;
        }
      } else {
        // sessoes a serem exibidas
        inventory.future_sessions += 1;
      }

      inventory.sessions += 1;
      // Espectadores por mês

      if (realQuorum > 0) {
        // realQuorum = parseInt(realQuorum);
        inventory.viewers += realQuorum;
        incrementOrCreate(
          inventory.viewers_per_month,
          `${getMonthName(screening.date.getMonth())} - ${screening.date.getFullYear()}`, realQuorum
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
  // if (inventory.sessions > 0) {
  return inventory;
  // }
};

Films.allow({
  insert(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
});

Films.attachSchema(Films.schema);

export default Films;
