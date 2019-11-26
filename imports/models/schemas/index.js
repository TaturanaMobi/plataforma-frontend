import SimpleSchema from 'simpl-schema';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import { Schema as userSchema } from '../users';
import Films from '../films';
import wNumb from '../utils/wNumb';
import getSelectOptions from './getSelectOptions';
// import { Cities, States } from '../states_and_cities';

export const NOTIFICATION_TRIGGERS = [
  'confirm_screening_date',
  'confirm_scheduling_3',
  'confirm_scheduling_9',
  'confirm_scheduling_10',
  'send_the_movie_3',
  'send_the_movie_9',
  'send_the_movie_10',
  'ask_for_report',
  'ask_for_report_2',
  'tell_ambassador_the_results',
];

export const FILM_CATEGORIES = [
  'Cineclube',
  'Coletivo',
  'Organização Social',
  'Universidade',
  'Escola Pública',
  'Escola Privada',
  'Instituição Governamental',
  'Espaços e Centros Culturais',
  'Equipamento Público',
  'Mídia/Blog/Site',
  'Formador de Opinião/Especialista',
  'Empresa',
  'Grupo Religioso',
  'Parque',
  'Outro',
];

export const FILM_SUBCATEGORIES = [
  'Audiovisual',
  'Artes Plásticas',
  'Cultura',
  'Educação/Ensino/Pedagogia',
  'Música',
  'Grafite',
  'Saúde',
  'SESC',
  'Meio Ambiente',
  'Gênero',
  'Ponto de Cultura',
  'Comunicação',
  'Direito',
  'Cidadania',
  'Psicologia/Psicanálise',
  'Juventude',
  'Dança',
  'Teatro',
  'Infância',
  'Política',
  'Maternidade',
  'Cidade',
  'Literatura',
  'Outro',
];

export const FILM_STATUS = ['Difusão', 'Oculto', 'Portfolio', 'Difusão/Portfolio'];

export const STATES = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO', 'NA'];

const FILM_AGE_RATING = ['Livre', '10 anos', '12 anos', '14 anos', '16 anos', '18 anos'];

export const SCREENING_STATUS = ['Agendada', 'Confirmada', 'Pendente', 'Rascunho', 'Concluída', 'Arquivada', 'Inválida'];

export const SCREENING_ACTIVITY = ['Abertura', 'Bate-papo', 'Encerramento', 'Vivência', 'Debate', 'Jogo', 'Aula', 'Livre', 'Gratis'];

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

const minDateNewScreening = new Date();
minDateNewScreening.setDate(minDateNewScreening.getDate() + 3);

Schemas.Screening = new SimpleSchema({
  oldId: {
    type: String,
    autoform: {
      type: 'hidden',
    },
    optional: true,
  },
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
    type: String,
    label: 'CEP',
    optional: true,
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
      type: 'select2',
      afFieldInput: {
        // multiple: false,
        // optionsMethod: 'getSelectCities',
        firstOption: 'Selecione',
      },
    },
    max: 1000,
  },
  uf: {
    type: String,
    label: 'Estado',
    allowedValues: STATES,
    autoform: {
      type: 'select',
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
    optional: true,
  },
  date: {
    type: Date,
    label: 'Data de exibição (Dia e Horário)',
    autoform: {
      afFieldInput: {
        type: 'bootstrap-datetimepicker',
        dateTimePickerOptions: {
          minDate: minDateNewScreening,
        },
        readonly: true,
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
      type: 'select',
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
          // start: 5,
          format: wNumb({
            decimals: 0,
          }),
          range: {
            min: 5,
            max: 500,
          },
          // step: 1,
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
      type: 'select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(SCREENING_STATUS),
        uniPlaceholder: 'Selecione',
      },
    },
  },
  draft: {
    type: Boolean,
    optional: true,
    label: 'Salvar como rascunho',
    autoform: {
      type: 'boolean-checkbox',
    },
  },

  real_quorum: {
    type: SimpleSchema.Integer,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'noUiSlider',
        noUiSliderOptions: {
          // tooltips: true,
          // start: 0,
          format: wNumb({
            decimals: 0,
          }),
          // range: {
          //   min: 0,
          //   max: 500,
          // },
          // step: 1,
        },
      },
    },
    label: 'Quantas pessoas viram o filme neste sessão?',
  },
  report_description: {
    type: String,
    label: `Conte como foi a sessão! Tente detalhar ao máximo, explicando por
exemplo como foi a reação/retorno dos participantes, e também como foi o
bate-papo e a atividade após o filme. Se puder, cite os conteúdos
abordados, relate as discussões mais interessantes e reproduza frases e
depoimentos relevantes.`,
    optional: true,
    max: 60000,
    autoform: {
      afFieldInput: {
        type: 'textarea',
        class: 'editor',
        rows: 10,
      },
    },
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
    label: 'Imagem para relatório 1',
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

Schemas.Report = new SimpleSchema({
  _id: {
    type: String,
    autoform: {
      type: 'hidden',
    },
  },
  oldId: {
    type: String,
    autoform: {
      type: 'hidden',
    },
  },
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

  reportCreatedAt: {
    type: Date,
    label: 'Data de criação do relatório',
    defaultValue: new Date(),
  },
  status: {
    type: String,
    label: 'Status',
    autoform: {
      type: 'select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(SCREENING_STATUS),
        uniPlaceholder: 'Selecione',
      },
    },
  },
  real_quorum: {
    type: SimpleSchema.Integer,
    autoform: {
      afFieldInput: {
        type: 'noUiSlider',
        noUiSliderOptions: {
          tooltips: true,
          // start: 5,
          format: wNumb({
            decimals: 0,
          }),
          range: {
            min: 0,
            max: 500,
          },
          // step: 1,
        },
      },
    },
    label: 'Quantas pessoas viram o filme neste sessão?',
  },
  report_description: {
    type: String,
    label: `Conte como foi a sessão! Tente detalhar ao máximo, explicando por
  exemplo como foi a reação/retorno dos participantes, e também como foi o
  bate-papo e a atividade após o filme. Se puder, cite os conteúdos
  abordados, relate as discussões mais interessantes e reproduza frases e
  depoimentos relevantes.`,
    max: 10000,
    autoform: {
      afFieldInput: {
        type: 'textarea',
        class: 'editor',
        rows: 10,
      },
    },
  },
  author_1: {
    type: String,
    label: 'Autor 1',
    max: 200,
    optional: true,
  },
  author_2: {
    type: String,
    label: 'Autor 2',
    max: 200,
    optional: true,
  },
  author_3: {
    type: String,
    label: 'Autor 3',
    max: 200,
    optional: true,
  },
  report_image_1: {
    type: String,
    label: 'Imagem para relatório 1',
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

Schemas.Film = new SimpleSchema({
  poster_path: {
    type: String,
    label: 'Cartaz (1280x720)',
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
    label: 'Imagem para home (720x720)',
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
    regEx: SimpleSchema.RegEx.Url,
    type: String,
    label: 'Link para download',
    max: 255,
  },
  password_for_download: {
    type: String,
    label: 'Senha para download',
    max: 255,
    optional: true,
  },
  status: {
    type: String,
    label: 'Status',
    autoform: {
      type: 'select',
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
        type: 'textarea',
        class: 'editor',
        rows: 6,
      },
    },
  },
  trailer_url: {
    type: String,
    label: 'Url do Trailer',
    max: 255,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  genre: {
    type: String,
    label: 'Gênero',
  },
  year: {
    type: SimpleSchema.Integer,
    label: 'Ano',
  },
  duration: {
    type: SimpleSchema.Integer,
    label: 'Duração em minutos',
  },
  country: {
    type: String,
    label: 'País',
    max: 100,
  },
  age_rating: {
    type: String,
    label: 'Classificação Indicativa',
    autoform: {
      type: 'select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(FILM_AGE_RATING),
        uniPlaceholder: 'Selecione',
      },
    },
  },
  production_company: {
    type: String,
    label: 'Produtora',
    max: 255,
    optional: true,
  },
  productionCompanyEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    max: 255,
    label: 'E-mail da Produtora',
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
    label: 'Ficha técnica',
    autoform: {
      afFieldInput: {
        type: 'textarea',
        class: 'editor',
        rows: 6,
      },
    },
    optional: true,
  },
  site: {
    type: String,
    label: 'Site',
    max: 100,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  facebook: {
    type: String,
    label: 'Facebook',
    max: 255,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  twitter: {
    type: String,
    label: 'Twitter',
    max: 255,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  instagram: {
    type: String,
    label: 'Instagram',
    max: 255,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  youtube: {
    type: String,
    label: 'YouTube',
    max: 255,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  createdAt: {
    type: Date,
    optional: true,
  },
  slug: {
    type: String,
    optional: true,
    label: 'Título na URL',
    max: 100,
    autoform: {
      type: 'hidden',
    },
  },
  press_kit_path: {
    type: String,
    label: 'Press kit',
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
  sequence_number: {
    type: SimpleSchema.Integer,
    optional: true,
  },
  statistics: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  slideshow: {
    type: Array,
    optional: true,
  },
  'slideshow.$': {
    type: Schemas.Slideshow,
  },
}, { tracker: Tracker });

Schemas.FormAdmFilter = new SimpleSchema({
  screeningDate: {
    type: String,
    optional: true,
    autoform: {
      type: 'select2',
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
    label: 'Mês Referência',
  },
  filmId: {
    type: String,
    label: 'Filme',
    optional: true,
    autoform: {
      type: 'select2',
      options: function autoFormOptions() {
        const opts = Films.find({}, { sort: { title: 1 } }).fetch().map(function(entity) {
          return {
            label: entity.title,
            value: entity._id,
          };
        });
        return opts;
      },
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  userId: {
    type: String,
    label: 'Embaixador',
    optional: true,
    autoform: {
      type: 'select2',
      options: function autoFormOptions2() {
        const opts = Meteor.users.find({}, { sort: { 'profile.name': 1 } }).fetch().map(function(entity) {
          return {
            label: entity.profile.name,
            value: entity._id,
          };
        });
        return opts;
      },
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  city: {
    type: String,
    label: 'Cidade',
    optional: true,
    autoform: {
      type: 'select2',
      // options: function autoFormOptions2() {
      //   const opts = Cities.find({}).fetch().map(function(entity) {
      //     return {
      //       label: entity.nome,
      //       value: entity._id,
      //     };
      //   });
      //   return opts;
      // },
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  state: {
    type: String,
    label: 'Estado',
    optional: true,
    autoform: {
      type: 'select2',
      // options: getSelectOptions(STATES),
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  status: {
    type: String,
    label: 'Status',
    optional: true,
    autoform: {
      type: 'select2',
      // options: getSelectOptions(STATES),
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  teamMember: {
    label: 'Participipação da equipe',
    type: Boolean,
    optional: true,
  },
  publicEvent: {
    label: 'Aberta ao público',
    type: Boolean,
    optional: true,
  },
  hasComments: {
    label: 'Possui comentários?',
    type: Boolean,
    optional: true,
  },
  missingReports: {
    label: 'Tem relatórios pendentes?',
    type: Boolean,
    optional: true,
  },
  categories: {
    type: String,
    optional: true,
    autoform: {
      type: 'select2',
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
    label: 'Área de Atuação',
  },
  subcategories: {
    type: String,
    label: 'Temática',
    optional: true,
    autoform: {
      type: 'select2',
      select2Options: {
        placeholder: 'Selecione',
        allowClear: true,
      },
    },
  },
  noScreenings: {
    label: 'Nunca agendou uma sessão?',
    type: Boolean,
    optional: true,
  },
}, { tracker: Tracker });

Schemas.NotificationTemplate = new SimpleSchema({
  name: {
    type: String,
    label: 'Nome',
  },
  trigger: {
    type: String,
    label: 'Nome do Gatilho',
    autoform: {
      options: getSelectOptions(NOTIFICATION_TRIGGERS),
      afFieldInput: {
        type: 'select',
      },
    },
  },
  subject: {
    type: String,
    label: 'Assunto da mensagem do e-mail',
  },
  body: {
    type: String,
    label: 'Corpo da mensagem do e-mail',
    autoform: {
      afFieldInput: {
        type: 'textarea',
        class: 'editor',
        rows: 6,
      },
    },
  },
  filmId: {
    type: String,
    label: 'Usar para filme específico',
    optional: true,
    autoform: {
      options: function autoFormOptions() {
        const opts = Films.find({}).fetch().map(function(entity) {
          return {
            label: entity.title,
            value: entity._id,
          };
        });
        return opts;
      },
      afFieldInput: {
        type: 'select',
      },
    },
  },
  createdAt: {
    type: String,
    label: 'Criado em',
    optional: true,
  },
  updatedAt: {
    type: String,
    label: 'Atualizado em',
    optional: true,
  },
}, { tracker: Tracker });

Schemas.Notification = new SimpleSchema({
  notificationTemplateId: {
    type: String,
    label: 'Template',
  },
  userId: {
    type: String,
    label: 'Enviado para',
  },
  screeningId: {
    type: String,
    label: 'Sessão Relacionada',
  },
  deliveredAt: {
    type: String,
    label: 'Entregue em',
    optional: true,
  },
  createdAt: {
    type: String,
    label: 'Criado em',
    optional: true,
  },
  updatedAt: {
    type: String,
    label: 'Atualizado em',
    optional: true,
  },
}, { tracker: Tracker });

export default Schemas;
