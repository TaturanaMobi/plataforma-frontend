// import UserSchema from './users';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';
// import { _ } from 'meteor/underscore';

import { Schema as userSchema } from './../users';
import wNumb from './../utils/wNumb';
import { FILM_AGE_RATING, FILM_STATUS, SCREENING_ACTIVITY, SCREENING_STATUS, STATES } from './../films';
import getSelectOptions from './getSelectOptions';

SimpleSchema.extendOptions(['autoform']);

SimpleSchema.extendOptions(['autoform']);
SimpleSchema.setDefaultMessages({
  initialLanguage: 'pt',
  messages: {
    pt: {
      passwordMismatch: 'Passwords não são iguais.',
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

      regEx({
        // label,
        regExp,
      }) {
        switch (regExp) {
          case (SimpleSchema.RegEx.Email.toString()):
          case (SimpleSchema.RegEx.EmailWithTLD.toString()):
            return 'E-mail inválido';
          case (SimpleSchema.RegEx.Domain.toString()):
          case (SimpleSchema.RegEx.WeakDomain.toString()):
            return 'Domínio inválido ou frágil';
          case (SimpleSchema.RegEx.IP.toString()):
            return 'Endereço de IP inválido';
          case (SimpleSchema.RegEx.IPv4.toString()):
            return 'Endereço de IPv4 inválido';
          case (SimpleSchema.RegEx.IPv6.toString()):
            return 'Endereço de IPv6 inválido';
          case (SimpleSchema.RegEx.Url.toString()):
            return 'URL inválida';
          case (SimpleSchema.RegEx.Id.toString()):
            return 'ID inválido';
          case (SimpleSchema.RegEx.ZipCode.toString()):
            return 'ZIP inválido';
          case (SimpleSchema.RegEx.Phone.toString()):
            return 'Número de telefone inválido';
          default:
            return 'Validação por expressão regular inválida';
        }
      },
    },
  },
});

const Schemas = {};

Schemas.User = userSchema.User;

Schemas.Screening = new SimpleSchema({
  filmId: {
    type: String,
    autoform: {
      type: 'hidden',
    },
  },
  user_id: {
    type: String,
    autoform: {
      type: 'hidden',
    },
  },
  place_name: {
    type: String,
    label: 'Nome do Local',
    max: 1000,
  },
  cep: {
    type: SimpleSchema.Integer,
    label: 'CEP',
    optional: true,
    min: 8,
  },
  street: {
    type: String,
    label: 'Rua',
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
    autoform: {
      type: 'universe-select',
      afFieldInput: {
        // multiple: false,
        optionsMethod: 'getSelectCities',
        uniPlaceholder: 'Selecione',
      },
    },
    max: 1000,
  },
  uf: {
    type: String,
    label: 'Estado',
    allowedValues: STATES,
    autoform: {
      type: 'universe-select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(STATES),
        uniPlaceholder: 'Selecione',
      },
    },
    max: 5,
  },
  s_country: {
    type: String,
    label: 'País',
    max: 1000,
  },
  date: {
    type: Date,
    label: 'Data de exibição (Dia e Horário)',
    autoform: {
      afFieldInput: {
        type: 'bootstrap-datetimepicker',
      },
    },
  },
  public_event: {
    label: 'Aberta ao público',
    type: Boolean,
    optional: true,
  },
  activity: {
    type: String,
    label: 'Haverá alguma atividade antes ou depois da exibição?',
    allowedValues: SCREENING_ACTIVITY,
    autoform: {
      type: 'universe-select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(SCREENING_ACTIVITY),
        uniPlaceholder: 'Selecione',
      },
    },
    max: 200,
  },
  activity_theme: {
    type: String,
    label: 'Esta atividade tem um tema?',
    optional: true,
  },
  team_member: {
    type: Boolean,
    label: 'Tenho interesse em que o diretor e/ou integrante da equipe do filme participem do bate-papo após a sessão ',
    optional: true,
  },
  quorum_expectation: {
    type: SimpleSchema.Integer,
    label: 'Quantas pessoas você projeta que irão assistir ao filme?',
    autoform: {
      afFieldInput: {
        type: 'noUiSlider',
        noUiSliderOptions: {
          tooltips: true,
          start: 5,
          format: wNumb({
            decimals: 0,
          }),
          range: {
            min: 5,
            max: 1000,
          },
          step: 1,
        },
      },
    },
  },
  comments: {
    type: String,
    label: 'Quer contar algo mais sobre a atividade ou fazer algum comentário?',
    autoform: {
      afFieldInput: {
        type: 'textarea',
        rows: 5,
        // class: 'editor'
        // settings: // summernote options goes here
      },
    },
    max: 8000,
  },
  accept_terms: {
    type: Boolean,
    allowedValues: [true],
    optional: false,
    label: 'Li e aceito os termos.',
    autoform: {
      type: 'boolean-checkbox',
    },
  },
  saveAddress: {
    type: Boolean,
    label: 'Salvar esse endereço',
    optional: true,
  },
  created_at: {
    type: Date,
    label: 'Data de criação',
    defaultValue: new Date(),
    optional: true,
  },
  updatedAt: {
    type: Date,
    label: 'Data da última atualização da sessão',
    defaultValue: new Date(),
    optional: true,
  },
  reportCreatedAt: {
    type: Date,
    label: 'Data de criação do relatório',
    defaultValue: new Date(),
    optional: true,
  },
  status: {
    type: String,
    label: 'Status',
    autoform: {
      type: 'universe-select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(SCREENING_STATUS),
        uniPlaceholder: 'Selecione',
      },
    },
  },
  real_quorum: {
    type: SimpleSchema.Integer,
    optional: true,
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
    autoform: {
      afFieldInput: {
        type: 'fileUpload',
        collection: 'Images',
        allowClientCode: true, // Required to let you remove uploaded file
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
  report_image_2: {
    type: String,
    label: 'Imagem para relatório 2',
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
  report_image_3: {
    type: String,
    label: 'Imagem para relatório 3',
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
}, { tracker: Tracker });

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
}, { tracker: Tracker });

Schemas.Film = new SimpleSchema(
  {
    poster_path: {
      type: String,
      label: 'Cartaz',
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
    },
    password_for_download: {
      type: String,
      label: 'Senha para download',
      max: 30,
      optional: true,
    },
    status: {
      type: String,
      label: 'Status',
      autoform: {
        type: 'universe-select',
        afFieldInput: {
          multiple: false,
          options: getSelectOptions(FILM_STATUS),
          uniPlaceholder: 'Selecione',
        },
      },
    },
    title: {
      type: String,
      label: 'Titulo do filme',
      max: 100,
    },
    synopsis: {
      type: String,
      label: 'Sinopse',
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor',
          settings: {
            toolbar: [
              ['style', ['bold', 'italic', 'underline', 'clear']],
              ['fontsize', ['fontsize']],
              ['para', ['ul']],
              ['insert', ['link', 'video', 'hr']],
            ],
          },
        },
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
      label: 'Gênero',
    },
    year: {
      type: SimpleSchema.Integer,
      label: 'Ano',
      max: 4,
    },
    length: {
      type: SimpleSchema.Integer,
      label: 'Duração em minutos',
      max: 10,
    },
    country: {
      type: String,
      label: 'País',
      max: 30,
    },
    age_rating: {
      type: String,
      autoform: {
        type: 'universe-select',
        afFieldInput: {
          multiple: false,
          options: getSelectOptions(FILM_AGE_RATING),
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
      label: 'Diretor(a)',
      max: 100,
      optional: true,
    },
    technical_information: {
      type: String,
      label: 'Informações técnicas',
      autoform: {
        afFieldInput: {
          type: 'summernote',
          class: 'editor',
          settings: {
            toolbar: [
              ['style', ['bold', 'italic', 'underline', 'clear']],
              ['fontsize', ['fontsize']],
              ['para', ['ul']],
              ['insert', ['link', 'video', 'hr']],
            ],
          },
        },
      },
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
      optional: true,
    },
    slug: {
      type: String,
      label: 'slug',
      max: 30,
      optional: true,
    },
    press_kit_path: {
      type: String,
      label: 'Press kit',
      max: 30,
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
    slideshow: {
      type: Array,
      optional: true,
    },
    'slideshow.$': {
      type: Schemas.Slideshow,
    },
  }, { tracker: Tracker }
);

export default Schemas;
