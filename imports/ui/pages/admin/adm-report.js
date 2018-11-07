import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';

import Films from './../../../api/films/films.js';

Template.admReport.helpers({
  film() {
    const screening_id = this._id;

    return Films.by_screening_id(screening_id);
  },
  in_slideshow(src) {
    let f = Films.by_screening_id(this._id);
    let images = f.slideshow;
    let result = false;

    if (!images) return false;

    _.each(images, (image) => {
      if (image.src === src) result = true;
    });

    return result;
  },
});

Template.admReport.events({
  'click .btn-image-add'(event) {
    event.preventDefault();

    const filmId = $('.report-images').data('film-id');

    Meteor.call('addToSlideshow', filmId, {
      _id: new Meteor.Collection.ObjectID().valueOf(),
      src: $(event.currentTarget).data('image-src'),
      caption: $(event.currentTarget).siblings('textarea').val(),
      author: $(event.currentTarget).data('author'),
    });
  },
  'click .btn-image-remove'(event) {
    event.preventDefault();

    const filmId = $('.report-images').data('film-id');

    Meteor.call(
      'removeFromSlideshow',
      filmId,
      $(event.currentTarget).data('image-src')
    );
  },
});
