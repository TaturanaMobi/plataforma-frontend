// import { Meteor } from 'meteor/meteor';
// import { Mongo } from 'meteor/mongo';
import { FilesCollection } from 'meteor/ostrio:files';

// const Images = new Mongo.Collection('images');

export const ImagesFiles = new FilesCollection({
  collectionName: 'Images',
  allowClientCode: true,
  storagePath: () => `${process.env.PWD}/uploads`,
  onBeforeUpload(file) {
    if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  },
});
