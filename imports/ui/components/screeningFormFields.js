import { Template } from 'meteor/templating';

import { Cities } from '../../models/states_and_cities';
import './screeningFormFields.html';

Template.screeningFormFields.helpers({
  cities() {
    return Cities.find({}).map(item => ({
      label: item.nome,
      value: item.nome,
    }));
  },
});
