import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { moment } from 'meteor/momentjs:moment';
import { Router } from 'meteor/iron:router';
import { Spacebars } from 'meteor/spacebars';

import Schemas from '../../models/schemas';
import Films from '../../models/films';
import Users from '../../models/users';
import NotificationTemplates from '../../models/notification_templates';
import Notifications from '../../models/notifications';
import Screenings from '../../models/screenings';
import Images from '../../models/images';

function youtubeParser(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;  // eslint-disable-line
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : false;
}

function vimeoParser(url) {
  // Look for a string with 'vimeo', then whatever, then a
  // forward slash and a group of digits.
  const match = /vimeo.*\/(\d+)/i.exec(url);

  // If the match isn't null (i.e. it matched)
  if (match) {
    // The grouped/matched digits from the regex
    return match[1];
  }
  return false;
}

Template.registerHelper('trailerParser', function (url) {
  const isYoutube = url.indexOf('youtu') > 0;
  const videoId = isYoutube ? youtubeParser(url) : vimeoParser(url);

  if (isYoutube) {
    return new Spacebars.SafeString(`<div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${videoId}"></div>`);
  }
  return new Spacebars.SafeString(`<div id="player" data-plyr-provider="vimeo" data-plyr-embed-id="${videoId}"></div>`);
});

Template.registerHelper('currentRouteIs', function (route) {
  return Router.current().route.getName() === route;
});

Template.registerHelper('isEqual', (arg1, arg2) => arg1 === arg2);

Template.registerHelper('isAdmin', () => Meteor.user().profile.roles.indexOf('admin') > -1);

Template.registerHelper('format_date', (date) => {
  const d = moment(date);

  return d.format('DD/MM/Y');
});

Template.registerHelper('format_date_from_now', (date) => {
  const d = moment(date);

  return d.fromNow();
});

Template.registerHelper('format_time', (date) => {
  const d = moment(date);

  return d.format('hh:mm A');
});

Template.registerHelper('shortsynopsis', function shortSynopsis() {
  const sText = String(this.synopsis).toString();

  if (sText.length > 430) {
    return `${sText.substring(0, 430)} ...`;
  }
  return sText;
});

Template.registerHelper('imageServerUrl', () => Meteor.settings.public.imageServerUrl || 'https://images.stag.taturanamobi.com.br/');

Template.registerHelper('fixImagePath', (imagePath) => {
  const re = /^images\//;
  return (imagePath.match(re) ? imagePath : `images/${Images.findOne(imagePath).path.split('images/')[1]}`);
});

Template.registerHelper('fixPressKitPath', (pressKitPath) => {
  const img = Images.findOne(pressKitPath);
  return (img ? img.link() : pressKitPath);
});

Template.registerHelper('snakecase', (str) => str.split(' ').join('_').toLowerCase());

export function saveAddress(form, userId) {
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
    Meteor.call('addAddress', userId, address);
  }

  return address;
}

export function getDateObject(date, time) {
  const d = date.value.split('/');
  const t = time.value.split(':');
  const t2 = t[1].split(' ');

  if (t2[1] === 'PM') t[0] = parseInt(t[0], 10) + 12;

  return new Date(d[2], parseInt(d[1], 10) - 1, d[0], t[0], t2[0]);
}

Template.registerHelper('Schemas', Schemas);
Template.registerHelper('Films', Films);
Template.registerHelper('Screenings', Screenings);
Template.registerHelper('NotificationTemplates', NotificationTemplates);
Template.registerHelper('Notifications', Notifications);
Template.registerHelper('Users', Users);
Meteor.subscribe('files.images.all');
