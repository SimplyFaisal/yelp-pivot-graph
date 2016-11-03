const credentials = require('./credentials.json');
const db = require('monk')('localhost/yelp');
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
