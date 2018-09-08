import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { _ } from 'meteor/underscore';
import { Router } from 'meteor/iron:router';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { moment } from 'meteor/momentjs:moment';

// import { Films } from '../../api/films/films.js';

import './new-screening.html';

function saveScreening(form, film_id, isDraft, action) {
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

    Meteor.call('addScreening', film_id, screening, function (error, result) {
      if (!error) {
        Router.go('ambassador');
      }
    });
    FlashMessages.sendSuccess('Sessão salva com sucesso!');
  } else {
    screening._id = form._id.value;
    Meteor.call('updateScreening', screening, function (error, result) {
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

function saveAddress(form, user_id) {
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

function getDateObject(date, time) {
  let d = date.value.split('/');
  let t = time.value.split(':');
  let t2 = t[1].split(' ');

  if (t2[1] == 'PM') t[0] = parseInt(t[0]) + 12;

  return new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);
}

Template.newScreening.onRendered(() => {
  const nowDate = new Date();
  const today = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() + 3, 0, 0, 0, 0);

  $('.readonly').keydown(function (e) {
    e.preventDefault();
  });
  $('#date').datepicker({
    format: 'dd/mm/yyyy',
    language: 'pt-BR',
    startDate: today,
  });
  $('.datetimepicker').timepicker();
  $("a[rel^='prettyPhoto']").prettyPhoto();
});

Template.newScreening.events({
  'submit form#new-screening-form'(event) {
    event.preventDefault();
    // Envia screening
    // TODO: add validation to the form
    const form = document.getElementById('new-screening-form');
    saveScreening(form, this._id, false, 'create-publish');
  },
  'click #btn-save'(event) {
    // Salva coomo rascunho
    // TODO: add validation to the form
    event.preventDefault();
    const form = document.getElementById('new-screening-form');
    saveScreening(form, this._id, true, 'create');
  },
  'click .remove_address'(event) {
    Meteor.call('removeAddress', Meteor.user()._id, this);
  },
  'click .replace_address': function () {
    // set state
    $('#uf').find('#' + this.uf).attr('selected', 'selected');
    Session.set('address', this);
  },
});

Template.newScreening.helpers({
  user_addresses() {
    if (!Meteor.user()) return;

    return Meteor.user().addresses;
  },
  address(replace_address) {
    return Session.get('address');
  },
  is_selected(state) {
    const address = Session.get('address');

    if (!address) return;

    if (address.uf == state) {
      return 'selected';
    }
  },
});
