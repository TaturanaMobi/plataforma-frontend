import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { AGE_RATING, STATUS } from './film-form-data.js';

function getSelectOptions(names) {
  const options = _.map(names, item => ({
    label: item,
    value: item,
  }));
  return options;
}

SimpleSchema.extendOptions(['autoform']);

SimpleSchema.setDefaultMessages({
  initialLanguage: 'pt',
  messages: {
    pt: {
      uploadError: 'Erro ao fazer upload!', // File-upload
      required: '{{{label}}} é obrigatório',
      minString: '{{{label}}} precisa ter no mínimo {{min}} caracteres',
      maxString: '{{{label}}} não pode ultrapassar {{max}} caracteres',
      minNumber: '{{{label}}} precisa ter no mínimo {{min}}',
      maxNumber: '{{{label}}} não pode ultrappasar {{max}}',
      minNumberExclusive: '{{{label}}} deve ser maior que {{min}}',
      maxNumberExclusive: '{{{label}}} deve ser menor que {{max}}',
      minDate: '{{{label}}} deve ser ao menos {{min}}',
      maxDate: '{{{label}}} não pode ser depois {{max}}',
      badDate: '{{{label}}} não é uma data válida',
      minCount: 'Você precisa especificar ao menos {{minCount}} valores',
      maxCount: 'Você não pode especificar mais que {{maxCount}} valores',
      noDecimal: '{{{label}}} deve conter apenas números',
      notAllowed: '{{{value}}} não é um valor permitido',
      expectedType: '{{{label}}} deve ser do tipo {{dataType}}',

      regEx({ label, regExp }) {
        switch (regExp) {
          case (SimpleSchema.RegEx.Email.toString()):
          case (SimpleSchema.RegEx.EmailWithTLD.toString()):
              return "Cette adresse e-mail est incorrecte";
          case (SimpleSchema.RegEx.Domain.toString()):
          case (SimpleSchema.RegEx.WeakDomain.toString()):
              return "Ce champ doit être un domaine valide";
          case (SimpleSchema.RegEx.IP.toString()):
              return "Cette adresse IP est invalide";
          case (SimpleSchema.RegEx.IPv4.toString()):
              return "Cette adresse IPv4 est invalide";
          case (SimpleSchema.RegEx.IPv6.toString()):
              return "Cette adresse IPv6 est invalide";
          case (SimpleSchema.RegEx.Url.toString()):
              return "Cette URL is invalide";
          case (SimpleSchema.RegEx.Id.toString()):
              return "Cet identifiant alphanumérique est invalide";
          case (SimpleSchema.RegEx.ZipCode.toString()):
              return "Ce code ZIP est invalide";
          case (SimpleSchema.RegEx.Phone.toString()):
              return "Ce numéro de téléphone est invalide";
          default:
              return "Ce champ a échoué la validation par Regex";
        }
      },
    }
  },
});

const Schemas = {};

Schemas.User = new SimpleSchema({
  username: {
    type: String,
    optional: true,
  },
  emails: {
    type: Array,
    optional: true,
  },
  'emails.$': {
    type: Object,
  },
  'emails.$.address': {
    type: String,
    regEx: SimpleSchema['RegEx'].Email,
  },
  'emails.$.verified': {
    type: Boolean,
  },
  registered_emails: {
    type: Array,
    optional: true,
  },
  'registered_emails.$': {
    type: Object,
    blackbox: true,
  },
  createdAt: {
    type: Date,
  },
  // profile: {
  //   type: Schemas.User,
  //   optional: true
  // },
  // Make sure this services field is in your schema if you're using any of the accounts packages
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // Add `roles` to your schema if you use the meteor-roles package.
  // Option 1: Object type
  // If you specify that type as Object, you must also specify the
  // `Roles.GLOBAL_GROUP` group whenever you add a user to a role.
  // Example:
  // Roles.addUsersToRoles(userId, ['admin'], Roles.GLOBAL_GROUP);
  // You can't mix and match adding with and without a group since
  // you will fail validation in some cases.
  roles: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  // In order to avoid an 'Exception in setInterval callback' from Meteor
  heartbeat: {
    type: Date,
    optional: true,
  },
}, { tracker: Tracker });

Schemas.Screening = new SimpleSchema({
  filmId: {
    type: String,
  },
  date: {
    type: Date,
    label: 'Data de Exibição',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'bootstrap-datetimepicker',
      },
    },
  },
  team_member: {
    type: Boolean,
    label: 'É membro?',
  },
  activity: {
    type: String,
    label: 'Atividade',
    max: 200,
    optional: true,
  },
  activity_theme: {
    type: String,
    label: 'Tema da Atividade',
    max: 1200,
    optional: true,
  },
  quorum_expectation: {
    type: SimpleSchema.Integer,
    label: 'Expectativa de Quórum',
  },
  comments: {
    type: String,
    label: 'Comentários',
    optional: true,
    max: 8000,
  },
  accept_terms: {
    type: Boolean,
    label: 'Aceita os termos?',
  },
  place_name: {
    type: String,
    label: 'Nome do Local',
    optional: true,
    max: 1000,
  },
  cep: {
    type: SimpleSchema.Integer,
    label: 'CEP',
    min: 8,
  },
  street: {
    type: String,
    label: 'Endereço',
    optional: true,
    max: 1000,
  },
  number: {
    type: SimpleSchema.Integer,
    label: 'Número',
  },
  complement: {
    label: 'Complemento',
    type: String,
    optional: true,
  },
  zone: {
    type: String,
    label: 'Bairro',
    optional: true,
    max: 1000,
  },
  city: {
    type: String,
    label: 'Cidade',
    optional: true,
    max: 1000,
  },
  public_event: {
    type: Boolean,
    optional: true,
  },
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
  created_at: {
    type: Date,
    label: 'Data de criação',
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'bootstrap-datetimepicker',
      },
    },
  },
  user_id: {
    type: String,
    optional: true,
  },
  real_quorum: {
    type: SimpleSchema.Integer,
    label: 'Quórum presente',
  },
  report_description: {
    type: String,
    label: 'Relatório',
    optional: true,
    max: 10000,
  },
  author_1: {
    type: String,
    label: 'Autor 1',
    optional: true,
    max: 200,
  },
  author_2: {
    type: String,
    label: 'Autor 2',
    optional: true,
    max: 200,
  },
  author_3: {
    type: String,
    label: 'Autor 3',
    optional: true,
    max: 200,
  },
  report_image_1: {
    type: String,
    label: 'Imagem para relatório',
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images',
    //     allowClientCode: true, // Required to let you remove uploaded file
    //     insertConfig: {
    //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
    //       meta: {},
    //       isBase64: false,
    //       transport: 'ddp',
    //       streams: 'dynamic',
    //       chunkSize: 'dynamic',
    //       allowWebWorkers: true,
    //     },
    //   },
    // },
  },
  report_image_2: {
    type: String,
    label: 'Imagem para relatório 2',
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images',
    //     insertConfig: {
    //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
    //       meta: {},
    //       isBase64: false,
    //       transport: 'ddp',
    //       streams: 'dynamic',
    //       chunkSize: 'dynamic',
    //       allowWebWorkers: true,
    //     },
    //   },
    // },
  },
  report_image_3: {
    type: String,
    label: 'Imagem para relatório 3',
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images',
    //     insertConfig: {
    //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
    //       meta: {},
    //       isBase64: false,
    //       transport: 'ddp',
    //       streams: 'dynamic',
    //       chunkSize: 'dynamic',
    //       allowWebWorkers: true,
    //     },
    //   },
    // },
  },
}, { tracker: Tracker });

Schemas.Slideshow = new SimpleSchema({
  src: {
    type: String,
    label: 'Imagem para home (360x370)',
    optional: true,
    // autoform: {
    //   afFieldInput: {
    //     type: 'fileUpload',
    //     collection: 'Images',
    //     insertConfig: {
    //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
    //       meta: {},
    //       isBase64: false,
    //       transport: 'ddp',
    //       streams: 'dynamic',
    //       chunkSize: 'dynamic',
    //       allowWebWorkers: true,
    //     },
    //   },
    // },
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
}, { tracker: Tracker });

Schemas.Film = new SimpleSchema(
  {
    poster_path: {
      type: String,
      label: 'Cartaz',
      optional: true,
      // autoform: {
      //   afFieldInput: {
      //     type: 'fileUpload',
      //     collection: 'Images',
      //     insertConfig: {
      //       meta: {},
      //       isBase64: false,
      //       transport: 'ddp',
      //       streams: 'dynamic',
      //       chunkSize: 'dynamic',
      //       allowWebWorkers: true
      //     }
      //   }
      // },
    },
    poster_home_path: {
      type: String,
      label: 'Imagem para home (360x370)',
      optional: true,
      // autoform: {
      //   afFieldInput: {
      //     type: 'fileUpload',
      //     collection: 'Images',
      //     insertConfig: {
      //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
      //       meta: {},
      //       isBase64: false,
      //       transport: 'ddp',
      //       streams: 'dynamic',
      //       chunkSize: 'dynamic',
      //       allowWebWorkers: true,
      //     },
      //   },
      // },
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
      // autoform: {
      //   rows: 10,
      //   class: 'editor'
      // }
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
    createdAt: {
      type: Date,
    },

    first_scheduling_notification: {
      type: String,
      label: 'Texto extra para email de confirmação de sessão',
      max: 400,
      optional: true,
      // autoform: {
      //   rows: 10
      // }
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
      // autoform: {
      //   afFieldInput: {
      //     type: 'fileUpload',
      //     collection: 'Images',
      //     insertConfig: {
      //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
      //       meta: {},
      //       isBase64: false,
      //       transport: 'ddp',
      //       streams: 'dynamic',
      //       chunkSize: 'dynamic',
      //       allowWebWorkers: true
      //     }
      //   }
      // }
    },
    press_kit_path: {
      type: String,
      label: 'Press kit',
      max: 30,
      optional: true,
      // autoform: {
      //   afFieldInput: {
      //     type: 'fileUpload',
      //     collection: 'Images',
      //     insertConfig: {
      //       // <- Optional, .insert() method options, see: https://github.com/VeliovGroup/Meteor-Files/wiki/Insert-(Upload)
      //       meta: {},
      //       isBase64: false,
      //       transport: 'ddp',
      //       streams: 'dynamic',
      //       chunkSize: 'dynamic',
      //       allowWebWorkers: true
      //     }
      //   }
      // }
    },
    slideshow: [Schemas.Slideshow],
  }, { tracker: Tracker }
);

export default Schemas;
