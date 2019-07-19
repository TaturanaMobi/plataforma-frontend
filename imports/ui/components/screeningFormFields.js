import { Template } from 'meteor/templating';

import { Cities } from '../../models/states_and_cities';
import './screeningFormFields.html';

Template.screeningFormFields.helpers({
  // form() {
  //   return this;
  // },
  // film() {
  //   // console.log(this);
  //   return this.film().fetch();
  // },
  cities() {
    const c = Cities.find({});
    const d = [];
    c.forEach(item => d.push({
      label: item.nome,
      value: item.nome,
    }));
    return d;
  },
});
