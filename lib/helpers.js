import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';

import { SUBCATEGORIES, CATEGORIES, ACTIVITY, STATUS, AGE_RATING } from '../lib/film-form-data.js';

if (Meteor.isClient) {
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
      status: (item == film_var) ? 'selected' : '' }));
    return ret;
  });

  Template.registerHelper('categories', () => ['Cineclube', 'Coletivo', 'Organização Social', 'Universidade', 'Escola Pública', 'Escola Privada', 'Instituição Governamental', 'Espaços e Centros Culturais', 'Equipamento Público', 'Mídia/Blog/Site', 'Formador de Opinião/Especialista', 'Empresa', 'Grupo Religioso', 'Parque', 'Outro']);

  Template.registerHelper('subcategories', () => ['Audiovisual', 'Artes Plásticas', 'Cultura', 'Educação/Ensino/Pedagogia', 'Música', 'Grafite', 'Saúde', 'SESC', 'Meio Ambiente', 'Gênero', 'Ponto de Cultura', 'Comunicação', 'Direito', 'Cidadania', 'Psicologia/Psicanálise', 'Juventude', 'Dança', 'Teatro', 'Infância', 'Política', 'Maternidade', 'Cidade', 'Literatura', 'Outro']);

  Template.registerHelper('isSelected', function (selectedValue) {
    return (this == selectedValue) ? 'selected' : '';
  });


  Template.registerHelper('format_date', (date) => {
    const d = moment(date);

    return d.format('D/M/Y');
  });

  Template.registerHelper('format_time', (date) => {
    const d = moment(date);

    return d.format('hh:mm A');
  });

  Template.registerHelper('shortsynopsis', function () {
    const s_text = this.synopsis;
    const n_text = s_text.substring(0, 430);
    if (n_text.length > 0) {
      return `${n_text}...`;
    }
  });

  Template.registerHelper('avatarPath', () => {
    const avatar = Meteor.user().profile.avatar_path;
    return (avatar) ? `/upload/${avatar}` :
      '/images/avatar-default.png';
  });

  Template.registerHelper('snakecase', str => str.split(' ').join('_').toLowerCase());
}
