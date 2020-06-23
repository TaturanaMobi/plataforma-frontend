import { Template } from 'meteor/templating';
// import { Router } from 'meteor/iron:router';
// import { $ } from 'meteor/jquery';
// import * as docx from "docx";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Media } from "docx";
import { saveAs } from 'file-saver';

import './adm-films-report.html';
import Screenings from '../../../models/screenings.js';
import Images from '../../../models/images';

const dotImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
function toDataURL(src, callback, outputFormat) {
  // Create an Image object
  var img = new Image();
  // Add CORS approval to prevent a tainted canvas
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    // Create an html canvas element
    var canvas = document.createElement('CANVAS');
    // Create a 2d context
    var ctx = canvas.getContext('2d');
    var dataURL;
    // Resize the canavas to the original image dimensions
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    // Draw the image to a canvas
    ctx.drawImage(this, 0, 0);
    // Convert the canvas to a data url
    dataURL = canvas.toDataURL(outputFormat);
    // Return the data url via callback
    callback(dataURL);
    // Mark the canvas to be ready for garbage
    // collection
    canvas = null;
  };
  // Load the image
  img.src = src;
  // make sure the load event fires for cached images too
  if (img.complete || img.complete === undefined) {
    // Flush cache
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
    // Try again
    img.src = src;
  }
}

const toDataURLPromise = function (src) {
  return new Promise((resolve) => {
    toDataURL(src, (base64) => {
      // if (err) reject(err)
      resolve(base64);
    });
  })
}



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

    const asyncForEach = async (array, callback) => {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    // for (const element in screenings) {
    screenings.forEach(async (element) => {
    // for (var i = 0, len = screenings.length; i < len; i++) {
    // const start = async () => {
    // asyncForEach(screenings, async (element) => {
      //   await waitFor(50);
      //   console.log(num);
      // })
      console.log(element);

      // const element = screenings[i];
      let image1 = '';
      if (typeof element.report_image_1 !== 'undefined') {
        image1 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_1)}`);
      } else {
        image1 = dotImage;
      }
      let image2 = '';
      if (element.report_image_2) {
        image2 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_2)}`);
      } else {
        image2 = dotImage;
      }
      let image3 = '';
      if (element.report_image_3) {
        image3 = await toDataURLPromise(`${Meteor.settings.public.imageServerUrl}/fit?width=300&height=300&type=jpeg&file=${fixImagePath(element.report_image_3)}`);
      } else {
        image3 = dotImage;
      }
      const ambassador = element.ambassador();

      const docImage1 = Media.addImage(doc, image1.replace(/^data:image\/(png|jpeg);base64,/, ""));
      const docImage2 = Media.addImage(doc, image2.replace(/^data:image\/(png|jpeg);base64,/, ""));
      const docImage3 = Media.addImage(doc, image3.replace(/^data:image\/(png|jpeg);base64,/, ""));
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
            children: [
              new TextRun({
                text: "Comentário:\n",
                bold: true,
              }),
              new TextRun(`${element.report_description}`),
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Fotos:\n",
                bold: true,
              }),
              docImage1,
              docImage2,
              docImage3,
            ]
          }),
        ],
      });
    });


    console.log('feito')
    Packer.toBlob(doc).then((blob) => {
      // saveAs from FileSaver will download the file
      saveAs(blob, `${film.title}-${new Date()}.docx`);
    });

    // }
    // start();
  }
})
