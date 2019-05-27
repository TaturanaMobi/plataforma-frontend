/* global document, window */

import { Meteor } from 'meteor/meteor';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Router } from 'meteor/iron:router';
import Films from '../../../models/films.js';

Template.admFilms.helpers({
  settings() {
    const instance = Template.instance();
    return {
      collection: instance.data,
      // filters: ['filterTeamMember'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      fields: [
        { label: 'Ações', key: 'actions', tmpl: Template.actionsCellTmpl2 },
        'title',
        'status',
        { label: 'Press Kit', key: 'press_kit_path', tmpl: Template.pressKitCellTmpl },
        {
          label: 'Data criação', key: 'createdAt', sortOrder: 0, sortDirection: 'descending', tmpl: Template.createdAtCellTmpl2,
        },
        // 'slug',
        'genre',
        { label: 'Poster', key: 'poster_path', tmpl: Template.posterCellTmpl },
        { label: 'Poster Home', key: 'poster_home_path', tmpl: Template.posterHomeCellTmpl },
      ],
    };
  },
  // films() {
  //   return Films.all();
  // },
  // posterData() {
  //   return { file_type: 'poster_path' };
  // },
  // pressKitData() {
  //   return { file_type: 'press_kit_path' };
  // },
  // posterHomeData() {
  //   return { file_type: 'poster_home_path' };
  // },
  // posterPath() {
  //   if (!Session.get('poster_path') && this.poster_path) {
  //     Session.set('poster_path', this.poster_path);
  //   }

  //   return Session.get('poster_path');
  // },
  // homePath() {
  //   if (!Session.get('poster_home_path') && this.poster_home_path) {
  //     Session.set('poster_home_path', this.poster_home_path);
  //   }

  //   return Session.get('poster_home_path');
  // },
});

Template.admFilms.events({
  'submit .new-film'(event) {
    event.preventDefault();

    const el = event.target;
    const synopsis = $('#synopsis').summernote('code');

    const poster = (el.poster_path === undefined) ? Session.get('poster_path') : el.poster_path.value;
    const press_kit = (el.press_kit_path === undefined) ? Session.get('press_kit_path') : el.press_kit_path.value;
    const poster_home = (el.poster_home_path === undefined) ? Session.get('poster_home_path') : el.poster_home_path.value;

    const film = {
      poster_path: poster,
      press_kit_path: press_kit,
      poster_home_path: poster_home,
      link_for_download: el.link_for_download.value,
      password_for_download: el.password_for_download.value,
      id: el.id.value,
      sequence_number: parseInt(el.sequence_number.value || (Films.count() + 1), 10),
      status: el.status.value,
      title: el.title.value,
      synopsis,
      trailer_url: el.trailer_url.value,
      genre: el.genre.value,
      year: el.year.value,
      length: el.length.value,
      country: el.country.value,
      age_rating: el.age_rating.value,
      production_company: el.production_company.value,
      director: el.director.value,
      technical_information: el.technical_information.value,
      site: el.site.value,
      facebook: el.facebook.value,
      twitter: el.twitter.value,
      instagram: el.instagram.value,
      youtube: el.youtube.value,
      createdAt: new Date(),
    };

    Meteor.call('updateOrCreateFilm', film);

    event.target.reset();
    FlashMessages.sendSuccess('Filme cadastrado com sucesso!');
    // Session.set('poster_path', null);
    // Session.set('poster_home_path', null);
    Router.go('adm/films');
  },
  'click .destroy'() {
    if (window.confirm(`Deseja realmente excluir o filme "${this.title}" ?`)) {
      Meteor.call('removeFilm', this._id);
    }
  },
  'click .destroy-img'(event) {
    console.log(event.target.src);
  },
  'click .btn-change-poster'(event) {
    event.preventDefault();

    this.poster_path = null;
    // Session.set('poster_path', null);
  },
  'click .btn-change-home'(event) {
    event.preventDefault();

    this.poster_home_path = null;
    // Session.set('poster_home_path', null);
  },
});
