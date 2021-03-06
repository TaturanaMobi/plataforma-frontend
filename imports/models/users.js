import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

import getSelectOptions from './schemas/getSelectOptions';

const STATES = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO', 'NA'];

const FILM_CATEGORIES = [
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

const FILM_SUBCATEGORIES = [
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
// import { Tracker } from 'meteor/tracker';
SimpleSchema.extendOptions(['autoform']);
SimpleSchema.setDefaultMessages({
  initialLanguage: 'pt',
  messages: {
    pt: {
      emailMismatch: 'E-mails não são iguais.',
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

export const Schema = {};

Schema.UserAddresses = new SimpleSchema({
  _id: {
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
      type: 'select2',
      afFieldInput: {
        // multiple: false,
        // optionsMethod: 'getSelectCities',
        firstOption: 'Selecione',
      },
    },
    // max: 1000,
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
        firstOption: 'Selecione',
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
});

Schema.UserProfile = new SimpleSchema({
  avatar_path: {
    type: String,
    label: 'Avatar',
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
  name: {
    type: String,
    label: 'Nome completo',
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  birthday: {
    type: Date,
    optional: true,
  },
  gender: {
    type: String,
    allowedValues: ['Male', 'Female'],
    optional: true,
  },
  organization: {
    type: String,
    optional: true,
  },
  website: {
    type: String,
    regEx: SimpleSchema.RegEx.Url,
    optional: true,
  },
  bio: {
    type: String,
    optional: true,
  },
  cell_phone: {
    type: String,
    label: 'Telefone celular*',
  },
  phone: {
    type: String,
    optional: true,
    label: 'Telefone fixo',
  },
  city: {
    type: String,
    label: 'Cidade',
    autoform: {
      type: 'select2',
      afFieldInput: {
        multiple: false,
        options: [],
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
        firstOption: 'Selecione',
      },
    },
    max: 5,
  },
  institution: {
    type: String,
    label: 'Você faz parte de alguma instituição, organização coletivo etc.? Caso sim, especifque o nome abaixo',
  },
  category: {
    type: String,
    optional: true,
    label: 'Qual a sua área de atuação?',
    autoform: {
      type: 'select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(FILM_CATEGORIES),
        firstOption: 'Selecione',
      },
    },
  },
  subcategory: {
    type: String,
    optional: true,
    label: 'Com quais temáticas vocês trabalham?',
    autoform: {
      type: 'select',
      afFieldInput: {
        multiple: false,
        options: getSelectOptions(FILM_SUBCATEGORIES),
        firstOption: 'Selecione',
      },
    },
  },
  roles: {
    type: Array,
    optional: true,
  },
  'roles.$': {
    type: String,
  },
});

Schema.User = new SimpleSchema({
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    label: 'E-mail',
  },
  confirmEmail: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    label: 'Repita seu E-mail',
    optional: true,
    custom() {
      if (this.value !== this.field('email').value) {
        return 'emailMismatch';
      }
      // return '';
    },
  },
  password: {
    type: String,
    label: 'Senha',
    min: 8,
    optional: true,
    autoform: {
      type: 'password',
    },
  },
  confirmPassword: {
    type: String,
    label: 'Repita a senha',
    optional: true,
    min: 8,
    custom() {
      if (this.value !== this.field('password').value) {
        return 'passwordMismatch';
      }
      // return '';
    },
    autoform: {
      type: 'password',
    },
  },
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
    regEx: SimpleSchema.RegEx.Email,
    label: 'E-mail',
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
    defaultValue: new Date(),
    optional: true,
  },
  profile: {
    type: Schema.UserProfile,
  },
  addresses: {
    type: Array,
    optional: true,
  },
  'addresses.$': {
    type: Schema.UserAddresses,
  },
  services: {
    type: Object,
    optional: true,
    blackbox: true,
  },
  heartbeat: {
    type: Date,
    optional: true,
  },
}, { tracker: Tracker });

Meteor.users.attachSchema(Schema.User);
// Meteor.users.helpers({
//   film() {
//     return Films.findOne(this.filmId);
//   },
//   ambassador() {
//     return Users.findOne(this.user_id);
//   }
// });

Meteor.users.allow({
  insert() {
    return true;
  },

  update(userId, doc) {
    // Can only change your own documents.
    return doc._id === userId;
  },
});

export default Meteor.users;
