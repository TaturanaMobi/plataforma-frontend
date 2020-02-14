import { Template } from 'meteor/templating';
// import { $ } from 'meteor/jquery';

import './adm-fluxo-by-screening.html';
import NotificationTemplates from '../../../models/notification_templates';

Template.admFluxoByScreening.helpers({
  settings() {
    const instance = Template.instance();
    return {
      collection: instance.data,
      // filters: ['filterTeamMember'],
      rowsPerPage: 100,
      showFilter: false,
      showRowCount: true,
      fields: [
        // { label: 'Ações', key: 'actions', tmpl: Template.actionsNotificationTemplateCellTmpl },
        {
          key: 'notificationTemplateId',
          label: 'Template',
          headerClass: 'col-md-2',
          fn: (value) => NotificationTemplates.find({ _id: value }).fetch()[0].name,
          // tmpl: Template.filmCellTmpl
        },

        // 'userId',
        // 'screeningId',
        'deliveredAt',
        'created_at',
        'updatedAt',
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
