import { Tracker } from 'meteor/tracker';
import SimpleSchema from 'simpl-schema';
import { _ } from 'meteor/underscore';

import { AGE_RATING, STATUS } from './film-form-data.js';

function getSelectOptions(names) {
  const options = _.map(names, item => ({
    label: item,
    value: item,
  }));
  return options;
}

const Schemas = {};

Schemas.Screening = new SimpleSchema({
  date: {
    type: Date,
    label: 'Data de criação',
    optional: true,
  },
  team_member: {
    type: Boolean,
    label: 'É membro?',
  },
  activity: {
    type: String,
    label: 'Atividade',
    max: 200,
  },
  activity_theme: {
    type: String,
    label: 'Tema da Atividade',
    max: 200,
  },
  quorum_expectation: {
    type: SimpleSchema.Integer,
    label: 'Expectativa de Quórum',
    min: 1,
  },
  comments: {
    type: String,
    label: 'Comentários',
    optional: true,
    max: 1000,
  },
  accept_terms: {
    type: Boolean,
    label: 'É membro?',
  },
  place_name: {
    type: String,
    label: 'Nome do Local',
    optional: true,
    max: 1000,
  },
  cep: {
    type: SimpleSchema.Integer,
    label: 'Expectativa de Quórum',
    min: 8,
  },
  street: {
    type: String,
    label: 'Nome do Local',
    optional: true,
    max: 1000,
  },
  number: {},
  complement: {},
  zone: {
    type: String,
    label: 'Nome do Local',
    optional: true,
    max: 1000,
  },
  city: {
    type: String,
    label: 'Nome do Local',
    optional: true,
    max: 1000,
  },
  public_event: {},
  uf: {
    type: String,
    label: 'Estado',
    optional: true,
    max: 3,
  },
  s_country: {
    type: String,
    label: 'País',
    optional: true,
    max: 1000,
  },
  created_at: {},
  user_id: {},
  real_quorum: {},
  report_description: {
    type: String,
    label: 'Relatório',
    optional: true,
    max: 10000,
  },
  author_1: {
    type: String,
    label: 'Autor',
    optional: true,
    max: 100,
  },
  author_2: {
    type: String,
    label: 'Autor',
    optional: true,
    max: 100,
  },
  author_3: {
    type: String,
    label: 'Autor',
    optional: true,
    max: 100,
  },
});

Schemas.Slideshow = new SimpleSchema({
  src: {
    type: String,
    label: 'Imagem para home (360x370)',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        insertConfig: {
          // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
          meta: {},
          isBase64: false,
          transport: 'ddp',
          streams: 'dynamic',
          chunkSize: 'dynamic',
          allowWebWorkers: true,
        },
      },
    },
  },
  caption: {
    type: String,
    label: 'Legenda',
    max: 1000,
    optional: true,
  },
  author: {
    type: String,
    label: 'Autor',
    max: 100,
    optional: true,
  },
});

Schemas.Film = new SimpleSchema(
  {
    poster_path: {
      type: String,
      label: 'Cartaz',
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images',
          insertConfig: {
            meta: {},
            isBase64: false,
            transport: 'ddp',
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true,
          },
        },
      },
    },
    poster_home_path: {
      type: String,
      label: 'Imagem para home (360x370)',
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images',
          insertConfig: {
            // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
            meta: {},
            isBase64: false,
            transport: 'ddp',
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true,
          },
        },
      },
    },
    link_for_download: {
      type: String,
      label: 'Link para download',
      max: 30,
      optional: true,
    },
    password_for_download: {
      type: String,
      label: 'Senha para download',
      max: 30,
      optional: true,
    },
    sequence_number: {
      type: String,
      label: 'Ordenação',
      max: 30,
      required: true,
    },
    status: {
      type: String,
      label: 'Status',
      autoform: {
        type: 'universe-select',
        afFieldInput: {
          multiple: false,
          options: getSelectOptions(STATUS),
          uniPlaceholder: 'Selecione',
        },
      },
    },
    title: {
      type: String,
      label: 'Titulo do filme*',
      max: 30,
      optional: false,
    },
    synopsis: {
      type: String,
      label: 'Sinopse*',
      max: 400,
      optional: false,
      autoform: {
        rows: 10,
        class: 'editor',
      },
    },
    trailer_url: {
      type: String,
      label: 'Url do Trailer',
      max: 30,
      optional: true,
    },
    genre: {
      type: String,
      label: 'Gênero*',
      optional: false,
    },
    year: {
      type: SimpleSchema.Integer,
      label: 'Ano*',
      max: 4,
      optional: false,
    },
    length: {
      type: SimpleSchema.Integer,
      label: 'Duração em minutos*',
      max: 10,
      optional: false,
    },
    country: {
      type: String,
      label: 'País*',
      max: 30,
      optional: false,
    },
    age_rating: {
      type: String,
      autoform: {
        type: 'universe-select',
        afFieldInput: {
          multiple: false,
          options: getSelectOptions(AGE_RATING),
          uniPlaceholder: 'Selecione',
        },
      },
    },
    production_company: {
      type: String,
      label: 'Production Company',
      max: 100,
      optional: true,
    },
    director: {
      type: String,
      label: 'Diretor',
      max: 100,
      optional: true,
    },
    technical_information: {
      type: String,
      label: 'Informações técnicas',
      max: 1000,
      optional: true,
    },
    site: {
      type: String,
      label: 'Site',
      max: 100,
      optional: true,
    },
    facebook: {
      type: String,
      label: 'Facebook',
      max: 30,
      optional: true,
    },
    twitter: {
      type: String,
      label: 'Twitter',
      max: 30,
      optional: true,
    },
    instagram: {
      type: String,
      label: 'Instagram',
      max: 30,
      optional: true,
    },
    youtube: {
      type: String,
      label: 'YouTube',
      max: 30,
      optional: true,
    },
    createdAt: {},

    first_scheduling_notification: {
      type: String,
      label: 'Texto extra para email de confirmação de sessão',
      max: 400,
      optional: true,
      autoform: {
        rows: 10,
      },
    },

    fake: {
      type: String,
      label: 'Fake',
      max: 30,
      optional: true,
    },
    slug: {
      type: String,
      label: 'slug',
      max: 30,
      optional: true,
    },

    poster_thumb_path: {
      type: String,
      label: 'Press kit',
      max: 30,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images',
          insertConfig: {
            // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
            meta: {},
            isBase64: false,
            transport: 'ddp',
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true,
          },
        },
      },
    },
    press_kit_path: {
      type: String,
      label: 'Press kit',
      max: 30,
      optional: true,
      autoform: {
        afFieldInput: {
          type: 'fileUpload',
          collection: 'Images',
          insertConfig: {
            // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
            meta: {},
            isBase64: false,
            transport: 'ddp',
            streams: 'dynamic',
            chunkSize: 'dynamic',
            allowWebWorkers: true,
          },
        },
      },
    },
    slideshow: [Schemas.Slideshow],
  },
  { tracker: Tracker }
);

export default Schemas;
