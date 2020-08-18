import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Media,
} from 'docx';
import { saveAs } from 'file-saver';

import './adm-films-report.html';
import Screenings from '../../../models/screenings.js';
import Images from '../../../models/images';

const { default: PQueue } = require('p-queue');

const dotImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

function makeRequest(method, url) {
  return new Promise(function (resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.responseType = 'blob';
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
        // resolve(xhr.response);
      } else {
        reject(new Error({
          status: this.status,
          statusText: xhr.statusText,
        }));
      }
    };
    xhr.onerror = function () {
      reject(new Error({
        status: this.status,
        statusText: xhr.statusText,
      }));
    };
    xhr.send();
  });
}

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
  return (imagePath && imagePath.match(re) ? imagePath : `images/${cImg.path !== undefined ? cImg.path.split('images/')[1] : ''}`);
};

const isImageUrl = (imagePath) => {
  const re = /\.(gif|jpe?g|tiff?|png|webp|bmp)$/i;
  return imagePath && imagePath.toLowerCase().match(re);
};

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
          }),
        ],
      });

      screenings.forEach(async (element) => {
        const ambassador = element.ambassador();

        await queue.add(async () => {
          const requestImage1 = isImageUrl(element.report_image_1) ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_1)}`) : { status: 500 };
          const requestImage2 = isImageUrl(element.report_image_2) ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_2)}`) : { status: 500 };
          const requestImage3 = isImageUrl(element.report_image_3) ? await makeRequest('GET', `${Meteor.settings.public.imageServerUrl}/smartcrop?width=600&height=338&type=jpeg&file=${fixImagePath(element.report_image_3)}`) : { status: 500 };
          // console.log(requestImage1, requestImage2, requestImage3);

          const docImage1 = Media.addImage(doc, element.report_image_1 && requestImage1 && requestImage1.match(/^data:/i) ? requestImage1 : dotImage, 600, 338);
          const docImage2 = Media.addImage(doc, element.report_image_2 && requestImage2 && requestImage2.match(/^data:/i) ? requestImage2 : dotImage, 600, 338);
          const docImage3 = Media.addImage(doc, element.report_image_3 && requestImage3 && requestImage3.match(/^data:/i) ? requestImage3 : dotImage, 600, 338);

          let paragrpahElement1;
          let paragrpahElement2;
          let paragrpahElement3;

          if (element.report_image_1 && (typeof requestImage1 !== 'undefined') && requestImage1.match(/^data:/i)) {
            paragrpahElement1 = docImage1;
          } else if (typeof element.report_image_1 !== 'undefined') {
            paragrpahElement1 = new TextRun({
              text: `https://stag.taturanamobi.com.br/old_uploads/${element.report_image_1}`,
              bold: true,
            });
          }

          if (element.report_image_2 && (typeof requestImage2 !== 'undefined') && requestImage2.match(/^data:/i)) {
            paragrpahElement2 = docImage2;
          } else if (typeof element.report_image_2 !== 'undefined') {
            paragrpahElement2 = new TextRun({
              text: `https://stag.taturanamobi.com.br/old_uploads/${element.report_image_2}`,
              bold: true,
            });
          }

          if (element.report_image_3 && (typeof requestImage3 !== 'undefined') && requestImage3.match(/^data:/i)) {
            paragrpahElement3 = docImage3;
          } else if (typeof element.report_image_3 !== 'undefined') {
            console.log('imprimiu link element.report_image_3');
            paragrpahElement3 = new TextRun({
              text: `https://stag.taturanamobi.com.br/old_uploads/${element.report_image_3}`,
              bold: true,
            });
          }

          doc.addSection({
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: 'Data:\n',
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
                    text: 'Local:\n',
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
                    text: 'Embaixador:\n',
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
                    text: 'Público:\n',
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
                    text: 'Comentário:\n',
                    bold: true,
                  }),
                  new TextRun(`${element.report_description}`),
                ],
              }),
              new Paragraph({
                spacing: {
                  before: 200,
                },
                children: [
                  new TextRun({
                    text: 'Fotos:\n',
                    bold: true,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  paragrpahElement1,
                  paragrpahElement2,
                  paragrpahElement3,
                ],
              }),
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
  },
});
