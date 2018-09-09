import { Meteor } from 'meteor/meteor';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';

import { SUBCATEGORIES, CATEGORIES, ACTIVITY, STATUS, AGE_RATING } from './../../api/film-form-data.js';

Template.registerHelper('isEqual', (arg1, arg2) => arg1 === arg2);

Template.registerHelper('isAdmin', () => Meteor.user().profile.roles.indexOf('admin') > -1);

Template.registerHelper('categories', () => _.map(CATEGORIES, item => ({ name: item })));

Template.registerHelper('subcategories', () => _.map(SUBCATEGORIES, item => ({ name: item })));

Template.registerHelper('ufs', () => ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RO', 'RS', 'RR', 'SC', 'SE', 'SP', 'TO']);

Template.registerHelper('returnSelectOptions', (names, film_var) => {
  const ret = _.map(eval(names), item => ({
    name: item,
    status: (item === film_var) ? 'selected' : '' }));
  return ret;
});

Template.registerHelper('categories', () => ['Cineclube', 'Coletivo', 'Organização Social', 'Universidade', 'Escola Pública', 'Escola Privada', 'Instituição Governamental', 'Espaços e Centros Culturais', 'Equipamento Público', 'Mídia/Blog/Site', 'Formador de Opinião/Especialista', 'Empresa', 'Grupo Religioso', 'Parque', 'Outro']);

Template.registerHelper('subcategories', () => ['Audiovisual', 'Artes Plásticas', 'Cultura', 'Educação/Ensino/Pedagogia', 'Música', 'Grafite', 'Saúde', 'SESC', 'Meio Ambiente', 'Gênero', 'Ponto de Cultura', 'Comunicação', 'Direito', 'Cidadania', 'Psicologia/Psicanálise', 'Juventude', 'Dança', 'Teatro', 'Infância', 'Política', 'Maternidade', 'Cidade', 'Literatura', 'Outro']);

Template.registerHelper('isSelected', function isSelected(selectedValue) {
  return (this === selectedValue) ? 'selected' : '';
});

Template.registerHelper('format_date', (date) => {
  const d = moment(date);

  return d.format('D/M/Y');
});

Template.registerHelper('format_time', (date) => {
  const d = moment(date);

  return d.format('hh:mm A');
});

Template.registerHelper('shortsynopsis', function shortSynopsis() {
  const s_text = this.synopsis;
  const n_text = s_text.substring(0, 430);
  return `${n_text}...`;
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

export function saveScreening(form, film_id, isDraft, action) {
  const user_id = form.user_id.value;
  const address = saveAddress(form, user_id);
  const date = getDateObject(form.date, form.time);
  const screening = {
    date: date,
    team_member: form.team_member.checked,
    activity: form.activity.value,
    activity_theme: form.activity_theme.value,
    quorum_expectation: form.quorum_expectation.value,
    comments: form.comments.value,
    accept_terms: form.accept_terms.checked,
    place_name: address.place_name,
    cep: address.cep,
    street: address.street,
    number: address.number,
    complement: address.complement,
    zone: address.zone,
    city: address.city,
    public_event: form.public_event.checked,
    uf: address.uf,
    s_country: address.s_country,
  };

  if (isDraft) {
    screening.draft = true;
  }

  if (action == 'create' || action == 'create-publish') {
    screening.created_at = new Date();
    screening.user_id = user_id;
    screening._id = new Meteor.Collection.ObjectID().valueOf();

    Meteor.call('addScreening', film_id, screening, (error, result) => {
      if (!error) {
        Router.go('ambassador');
      }
    });
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
  } else {
    screening._id = form._id.value;
    Meteor.call('updateScreening', screening, (error, result) => {
      if (!error) {
        if (Meteor.user().profile.roles[0] === 'admin') {
          Router.go('adm/sessions');
        } else {
          Router.go('ambassador');
        }
      }
    });
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
  }

  Session.set('address', null);
}