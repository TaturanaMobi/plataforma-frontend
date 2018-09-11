/* global document, window, navigator */

import { _ } from 'meteor/underscore';
import { Template } from 'meteor/templating';

import { Films } from '../../../api/films/films.js';

Template.admSessions2.helpers({
  settings() {
    const d = Films.find({});
    const screenings = [];
    if (d !== null) {
      d.forEach((f) => {
        if (f !== null && f.screening !== null) {
          // const sNotDuplicated = [];
          _(f.screening).each((s) => {
            if (!screenings.find(x => parseInt(x._id, 16) === parseInt(s._id, 16))) {
              screenings.push(s);
            } else {
              console.log(s); // log duplicated entries
            }
          });
        }
      });
    }
    const s = screenings;
    console.log(s);
    return {
      collection: s,
      rowsPerPage: 10,
      showFilter: true,
      fields: ['_id', 'user_id',
        'place_name', 'public_event', 'quorum_expectation', 'date',
        // 'comments',

        'city', 'uf', 's_country', 'street', 'number', 'complement', 'zone', 'cep',
        // '​accept_terms', '​activity', 'activity_theme', 'author_1', 'author_2',
        // 'author_3', 'real_quorum', 'report_description', 'team_member',
      ],
    };
  },
});
