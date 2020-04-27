import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

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
});

Template.admFilms.events({
  'click .destroy'() {
    if (window.confirm(`Deseja realmente excluir o filme "${this.title}" ?`)) {
      Meteor.call('removeFilm', this._id);
    }
  },
  // 'click .destroy-img'(event) {
  //   console.log(event.target.src);
  // },
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
