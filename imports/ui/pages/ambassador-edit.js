import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { FlashMessages } from 'meteor/mrt:flash-messages';

import Films from './../../api/films/films.js';

import './ambassador-edit.html';

Template.ambassadorEdit.helpers({
  avatarData() {
    return { file_type: 'avatar_path' };
  },
  amount_film_screenings() {
    const scrs = Films.screenings_by_user_id(Meteor.userId());
    const today = new Date();
    let pastScr = 0;
    let people = 0;

    _.each(scrs, (scr) => {
      if (scr.date.getTime() < today.getTime()) {
        if (scr.real_quorum) {
          people = parseInt(scr.real_quorum, 10) + people;
        }
        pastScr += 1;
      }
    });

    return { pastScr, people };
  },
  amount_films() {
    return Films.by_user_id(Meteor.userId()).length;
  },
});

Template.ambassadorEdit.events({
  'submit .ambassador-edit'(event) {
    event.preventDefault();

    const avatar_path = (event.target.avatar_path === undefined) ? Session.get('avatar_path') : event.target.avatar_path.value;
    const email = event.target.email.value;
    const profile = {
      name: event.target.name.value,
      avatar_path,
      cell_phone: event.target.cell_phone.value,
      phone: event.target.phone.value,
      country: event.target.country.value,
      city: event.target.city.value,
      uf: event.target.uf.value,
      institution: event.target.institution.value,
      category: event.target.category.value,
      subcategory: event.target.subcategory.value,
    };

    Meteor.call('updateUser', profile, email);
    FlashMessages.sendSuccess('Atualização efetuada com sucesso!');
    Router.go('ambassador');
  },
  'click .destroy'() {
    Meteor.call('removeScreening', this._id);
  },
});