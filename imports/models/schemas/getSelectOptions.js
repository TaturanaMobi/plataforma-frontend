import { _ } from 'meteor/underscore';

export default (names) => _.map(names, (item) => ({
  label: item,
  value: item,
}));
