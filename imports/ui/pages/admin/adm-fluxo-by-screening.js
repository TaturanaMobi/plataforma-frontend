import { Template } from 'meteor/templating';
import Users from '../../../models/users'
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
          headerClass: 'col-md-6',
          sortable: false,
          fn: (value) =>{
            const nt = NotificationTemplates.find(value).fetch()[0]
            return new Spacebars.SafeString(`<a href="/adm/notification-templates-edit/${nt._id}">${nt.name}</a>`);
          },
          // tmpl: Template.filmCellTmpl
        },
        'to',
        {
          key: 'userId',
          label: 'usuário',
          headerClass: 'col-md-6',
          sortable: false,
          fn: (value) =>{
            // console.log(value);
            // this.autorun(() => {
            //   this.subscribe('users.byEmail', value);
            // });
            const u = Users.findOne(value);
            return new Spacebars.SafeString(`<a href="/adm/ambassador/${u?._id}">${u?.profile.name} - ${u.emails[0].address}</a>`);
          },
          // tmpl: Template.filmCellTmpl
        },
        // 'screeningId',
        {
          key: 'deliveredAt',
          sortByValue: true,
          label: 'E-mail entregue em',
          fn: function (value) {
            return new Spacebars.SafeString(moment(value).format('DD/MM/YYYY hh:mm A'));
          },
       },
        // 'createdAt',
        // 'updatedAt',
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
