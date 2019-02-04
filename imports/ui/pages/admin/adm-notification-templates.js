import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';

import './adm-notification-templates.html';

Template.admNotificationTemplates.helpers({
  settings() {
    const instance = Template.instance();
    return {
      collection: instance.data,
      // filters: ['filterTeamMember'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      fields: [
          { label: 'Ações', key: 'actions', tmpl: Template.actionsNotificationTemplateCellTmpl },
        'trigger',
        'name',
        'subject',
        // 'body',
        'filmId',
        {
          label: 'Data criação', key: 'createdAt', sortOrder: 0, sortDirection: 'descending', tmpl: Template.createdAtCellTmpl2,
        },
      ],
      //   'status',
      //   { label: 'Press Kit', key: 'press_kit_path', tmpl: Template.pressKitCellTmpl },
      //   // 'slug',
      //   'genre',
      //   { label: 'Poster', key: 'poster_path', tmpl: Template.posterCellTmpl },
      //   { label: 'Poster Home', key: 'poster_home_path', tmpl: Template.posterHomeCellTmpl },
      // ],
    };
  },
});
