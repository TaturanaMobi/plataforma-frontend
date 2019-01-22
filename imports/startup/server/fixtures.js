import { Meteor } from 'meteor/meteor';
import Films from '../../models/films';
// import Screenings from '../../models/screenings';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Films.find().count() === 0) {
    // const data = [
    //   {
    //     poster_path,
    //     poster_home_path,
    //     link_for_download,
    //     status,
    //     synopsis,
    //     genre,
    //     year,
    //     duration,
    //     country,
    //     age_rating,
    //     slug,
    //     press_kit_path,
    //     title: 'Meteor Principles',
    //     screenings: [
    //       'Data on the Wire',
    //       'One Language',
    //       'Database Everywhere',
    //       'Latency Compensation',
    //       'Full Stack Reactivity',
    //       'Embrace the Ecosystem',
    //       'Simplicity Equals Productivity',
    //     ],
    //   },
    // ];

    // let timestamp = (new Date()).getTime();

    // data.forEach((film) => {
    //   const filmId = Films.insert({
    //     name: film.name,
    //   });

    //   film.screenings.forEach((text) => {
    //     Screenings.insert({
    //       filmId,
    //       text,
    //       createdAt: new Date(timestamp),
    //     });

    //     timestamp += 1; // ensure unique timestamp.
    //   });
    // });
  }
});
