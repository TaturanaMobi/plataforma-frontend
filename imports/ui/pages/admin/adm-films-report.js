import { Template } from 'meteor/templating';
// import { Router } from 'meteor/iron:router';
// import { $ } from 'meteor/jquery';
// import * as docx from "docx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Media } from "docx";
import { saveAs } from 'file-saver';
const { default: PQueue } = require('p-queue');
import './adm-films-report.html';
import Screenings from '../../../models/screenings.js';
import Images from '../../../models/images';

function promisify(f) {
  return function (...args) { // return a wrapper-function
    return new Promise((resolve, reject) => {
      function callback(err, result) { // our custom callback for f
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }

      args.push(callback); // append our custom callback to the end of f arguments

      f.call(this, ...args); // call the original function
    });
  };
};

// usage:
// let loadScriptPromise = promisify(loadScript);
// loadScriptPromise(...).then(...);

const dotImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// function toDataURL(src, callback, outputFormat) {
//   // Create an Image object
//   var img = new Image();
//   // Add CORS approval to prevent a tainted canvas
//   img.crossOrigin = 'Anonymous';
//   img.onload = function () {
//     // Create an html canvas element
//     var canvas = document.createElement('CANVAS');
//     // Create a 2d context
//     var ctx = canvas.getContext('2d');
//     var dataURL;
//     // Resize the canavas to the original image dimensions
//     canvas.height = this.naturalHeight;
//     canvas.width = this.naturalWidth;
//     // Draw the image to a canvas
//     ctx.drawImage(this, 0, 0);
//     // Convert the canvas to a data url
//     dataURL = canvas.toDataURL(outputFormat);
//     // Return the data url via callback
//     callback(dataURL);
//     // Mark the canvas to be ready for garbage
//     // collection
//     canvas = null;
//   };
//   // Load the image
//   img.src = src;
//   // make sure the load event fires for cached images too
//   if (img.complete || img.complete === undefined) {
//     // Flush cache
//     img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
//     // Try again
//     img.src = src;
//   }
// }
function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.error, reader.result);
    }
    reader.readAsDataURL(xhr.response);
  };
  xhr.open('GET', url);
  xhr.responseType = 'blob';
  xhr.send();
}

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
        // resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

const toDataURLPromise = promisify(toDataURL);

// let loadScriptPromise = promisify(loadScript);
// loadScriptPromise(...).then(...);

const queue = new PQueue({ concurrency: 1 });

Template.admFilmsReport.helpers({
  screenings() {
    const result = Screenings.find();
    return result;
  },
});

const fixImagePath = (imagePath) => {
  const re = /^images\//;
  const cImg = Images.findOne(imagePath);
  return (imagePath.match(re) ? imagePath : `images/${cImg.path !== undefined ? cImg.path.split('images/')[1] : ''}`);
}

Template.admFilmsReport.events({
  'click .export-docx'() {
    (async () => {

      const doc = new Document();
      const film = Template.instance().data;
      const screenings = Screenings.find();

      doc.addSection({
        properties: {},
        children: [
          new Paragraph({
            text: film.title,
            heading: HeadingLevel.HEADING_1,
          })
        ]
      });

      // const asyncForEach = async (array, callback) => {
      //   for (let index = 0; index < array.length; index++) {
      //     await callback(array[index], index, array);
      //   }
      // }

      // for (const element in screenings) {
      screenings.forEach(async (element) => {
        // for (var i = 0, len = screenings.length; i < len; i++) {
        // const start = async () => {
        // asyncForEach(screenings, async (element) => {
        //   await waitFor(50);
        //   console.log(num);
        // })

        // const element = screenings[i];
        // let image1 = '';
        // if (typeof element.report_image_1 !== 'undefined') {
        //   image1 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_1)}`);
        // } else {
        //   image1 = dotImage;
        // }
        // let image2 = '';
        // if (element.report_image_2) {
        //   image2 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_2)}`);
        // } else {
        //   image2 = dotImage;
        // }
        // let image3 = '';
        // if (element.report_image_3) {
        //   image3 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_3)}`);
        // } else {
        //   image3 = dotImage;
        // }
        const ambassador = element.ambassador();

        // await queue.add(() => {got('https://sindresorhus.com')});

        await queue.add(async () => {

          const docImage1 = Media.addImage(doc, element.report_image_1 ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_1)}`) : dotImage, 600, 338);
          const docImage2 = Media.addImage(doc, element.report_image_2 ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_2)}`) : dotImage, 600, 338);
          const docImage3 = Media.addImage(doc, element.report_image_3 ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_3)}`) : dotImage, 600, 338);
          // console.log(element);
          doc.addSection({
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Data:\n",
                    bold: true,
                  }),
                  new TextRun(`${element.date}`),
                ],
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: "Local:\n",
                    bold: true,
                  }),
                  new TextRun(`${element.place_name}
               ${element.street} ${element.number} ${element.complement} ${element.zone}
               ${element.city} - ${element.uf}, ${element.s_country}`),
                ],
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: "Embaixador:\n",
                    bold: true,
                  }),
                  new TextRun(`${ambassador.profile.name}
               ${ambassador.profile.cell_phone} / ${ambassador.profile.phone}
               ${ambassador.emails[0].address}`),
                ],
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: "Público:\n",
                    bold: true,
                  }),
                  new TextRun(`esperado: ${element.quorum_expectation}
               presente:${element.real_quorum}`),
                ],
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: "Comentário:\n",
                    bold: true,
                  }),
                  new TextRun(`${element.report_description}`),
                ]
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: "Fotos:\n",
                    bold: true,
                  }),
                ]
              }),
              new Paragraph({
                children: [
                  (element.report_image_1 ? docImage1 : ''),
                  (element.report_image_2 ? docImage2 : ''),
                  (element.report_image_3 ? docImage3 : ''),
                ]
              })
            ],
          });
        });
      });

      await queue.add(() => {
        Packer.toBlob(doc).then((blob) => {
          // saveAs from FileSaver will download the file
          saveAs(blob, `${film.title}-${new Date()}.docx`);
        });
      });
    })();
  }
})
