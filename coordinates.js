const util = require('util');
const credentials = require('./credentials.json');
const uri = util.format('mongodb://%s:%s@ds139847.mlab.com:39847/yelp',
  credentials.mongo.username, credentials.mongo.password);
const db = require('monk')(uri);
const Business = db.get('business');
const User = db.get('user');
const Review = db.get('review')

Business.find().then((docs) =>{
  console.info('Retrieved Documents');
  docs.forEach((doc) => {
    Business.update({_id: doc._id}, {
      $set: {
        location: {
          type: 'Point',
          coordinates: [doc.longitude, doc.latitude]
        }
      }
    });
  });
});
