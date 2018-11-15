import { Meteor } from 'meteor/meteor';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';
import { Router } from 'meteor/iron:router';

Template.registerHelper('isEqual', (arg1, arg2) => arg1 === arg2);

Template.registerHelper('isAdmin', () => Meteor.user().profile.roles.indexOf('admin') > -1);

Template.registerHelper('returnSelectOptions', (names, film_var) => {
  const ret = _.map(eval(names), item => ({
    name: item,
    status: (item === film_var) ? 'selected' : '' }));
  return ret;
});

Template.registerHelper('isSelected', function isSelected(selectedValue) {
  return (this === selectedValue) ? 'selected' : '';
});

Template.registerHelper('format_date', (date) => {
  const d = moment(date);

  return d.format('D/M/Y');
});

Template.registerHelper('format_date_from_now', (date) => {
  const d = moment(date);

  return d.fromNow();
});

Template.registerHelper('format_time', (date) => {
  const d = moment(date);

  return d.format('hh:mm A');
});

Template.registerHelper('shortsynopsis', function shortSynopsis() {
  const sText = String(this.synopsis).toString();

  if (sText.length > 430) {
    return `${sText.substring(0, 430)} ...`;
  }
  return sText;
});

Template.registerHelper('avatarPath', () => {
  const avatar = Meteor.user().profile.avatar_path;
  return (avatar) ? `/upload/${avatar}` :
    '/images/avatar-default.png';
});

Template.registerHelper('snakecase', str => str.split(' ').join('_').toLowerCase());

export function saveAddress(form, user_id) {
  const address = {
    _id: new Meteor.Collection.ObjectID().valueOf(),
    place_name: form.place_name.value,
    cep: form.cep.value,
    street: form.street.value,
    number: form.number.value,
    complement: form.complement.value,
    zone: form.zone.value,
    city: form.city.value,
    uf: form.uf.value,
    s_country: form.s_country.value,
  };

  if (form.add_address.checked) {
    Meteor.call('addAddress', user_id, address);
  }

  return address;
}

export function getDateObject(date, time) {
  let d = date.value.split('/');
  let t = time.value.split(':');
  let t2 = t[1].split(' ');

  if (t2[1] === 'PM') t[0] = parseInt(t[0], 10) + 12;

  return new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);
}

// AutoForm.setDefaultTemplate('plain');

AutoForm.addHooks(['new-screening-form'], {

  // Called when any submit operation succeeds
  onSuccess: (formType, result) => {
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
    setTimeout(() => {
      Router.go('/ambassador');
    }, 2000);
    return result;
  },

  // Called when any submit operation fails
  onError: function(formType, error) {
    FlashMessages.sendError('Preencha todas as informações.');
  },

});
