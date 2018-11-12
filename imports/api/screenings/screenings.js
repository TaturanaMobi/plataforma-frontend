import { Mongo } from 'meteor/mongo';
import Schemas from '../schemas';

const Screenings = new Mongo.Collection('screenings');
Screenings.attachSchema(Schemas.Screening);
Screenings.allow({
  insert(userId) {
    // only allow posting if you are logged in
    return !!userId;
  },
});

export default Screenings;
