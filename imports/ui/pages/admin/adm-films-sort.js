import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

Template.admFilmsSort.helpers({
  films() {
    const instance = Template.instance();
    return instance.data;
    // return instance.data.map((item, index) => {
    //   return {
    //     title: item.title,
    //   };
    // });
  },
});

Template.admFilmsSort.onRendered(() => {
  $('.sortable').sortable({
    update: (event) => {
      const sortable = $(event.target);
      const ids = [];
      sortable.children().each((index, item) => { ids.push(item.id.replace(/.+-/, '')); });
      Meteor.call('reorderFilms', ids);
    },
  });
});

Template.admFilmsSort.events({
  'click .film-up'(event) {
    const filmId = event.target.id.replace(/^.+-/, '');
    const li = $(event.target).parent().parent();
    li.insertBefore(li.prev());
    li.parent().sortable();
    Meteor.call('reorderFilm', filmId, -1);
  },
  'click .film-down'(event) {
    const filmId = event.target.id.replace(/^.+-/, '');
    const li = $(event.target).parent().parent();
    li.insertAfter(li.next());
    Meteor.call('reorderFilm', filmId, 1);
  },
});
