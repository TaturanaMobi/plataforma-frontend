import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { STATES } from './films';
import { getSelectOptions } from './schemas';

// import { Tracker } from 'meteor/tracker';

const Schema = {};

Schema.UserCountry = new SimpleSchema({
  name: {
    type: String,
  },
  code: {
    type: String,
    regEx: /^[A-Z]{2}$/,
  },
});

Schema.UserAddresses = new SimpleSchema({
  addresses: {
    type: Array,
    optional: true,
  },
  'addresses.$': {
    type: Object,
  },
  'addresses.$.place_name': {
    type: String,
    label: 'Nome do Local',
    max: 1000,
  },
  'addresses.$.cep': {
    type: SimpleSchema.Integer,
    label: 'CEP',
    optional: true,
    min: 8,
  },
  'addresses.$.street': {
    type: String,
    label: 'Rua',
    max: 1000,
  },
  'addresses.$.number': {
    type: SimpleSchema.Integer,
    label: 'Número',
  },
  'addresses.$.complement': {
    label: 'Complemento',
    type: String,
    optional: true,
  },
  'addresses.$.zone': {
    type: String,
    label: 'Bairro',
    optional: true,
    max: 1000,
  },
  'addresses.$.city': {
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
  'addresses.$.uf': {
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
  'addresses.$.s_country': {
    type: String,
    label: 'País',
    max: 1000,
  },
});

Schema.UserProfile = new SimpleSchema({
  name: {
    type: String,
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
  country: {
    type: Schema.UserCountry,
    optional: true,
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
  profile: {
    type: Schema.UserProfile,
    optional: true,
  },
  addresses: {
    type: Schema.UserAddresses,
    optional: true,
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
});

const Users = Meteor.users;
Users.attachSchema(Schema.User);
// Users.helpers({
//   film() {
//     return Films.findOne(this.filmId);
//   },
//   ambassador() {
//     return Users.findOne(this.user_id);
//   }
// });

export default Users;
