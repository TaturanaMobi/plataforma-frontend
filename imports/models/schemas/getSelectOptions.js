import _ from 'underscore';

export default (names) => _.map(names, (item) => ({
  label: item,
  value: item,
}));
