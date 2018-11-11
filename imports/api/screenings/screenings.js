import { Mongo } from 'meteor/mongo';
import Schemas from '../schemas';

const Screenings = new Mongo.Collection('screenings');
Screenings.attachSchema(Schemas.Screening);

export default Screenings;
