const express = require('express');
const morgan = require('morgan');
const graph = require('./graph');
const bodyParser = require('body-parser');
const Promise = require('bluebird');
const util = require('util');
const credentials = require('./credentials.json');
const app = express();

const Yelp = require('yelp');

const yelp = new Yelp(credentials.yelp);

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const uri = util.format('mongodb://%s:%s@ds139847.mlab.com:39847/yelp',
  credentials.mongo.username, credentials.mongo.password);

const db = require('monk')(uri);
const Business = db.get('business');
const User = db.get('user');
const Review = db.get('review')

const api = express.Router();

api.get('/locations', (request, response) => {
  Business.distinct('city').then((cities) => {
    cities.sort();
    response.json(cities);
  });
});

api.get('/graph', (request, response) => {
  var locations = request.query.locations.split(',');
  var query = {city: {$in: locations}, categories: 'Restaurants'};
  Business.find(query).then((businesses) => {
    graph.createGraph(businesses).then((G) => {
      response.json(G);
    })
    .catch((error) => {
      console.error(error);
    });
  })
  .catch((error) => {
    console.error(error);
  });
});

api.post('/yelp', (request, response) => {
  var locations = request.body.locations;
  var EARTH_RADIUS = 6378.1 * 1000;
  var promises = locations.map((location) => {
    // in meters
    return new Promise((resolve, reject) => {
      var query = {
        location: {
          $geoWithin: {
            $centerSphere: [
                [location.coordinates.lng, location.coordinates.lat],
                location.radius / EARTH_RADIUS
              ],
          }
        }
      };

      Business.find(query).then((businesses) => {
        resolve(businesses);
      })
      .catch((error) => {
        response.json(error);
      })
   });
 });

 Promise.all(promises).then((buckets) => {
   buckets.forEach((bucket, i) => {
     bucket.forEach((business) => {
       business.location_id = locations[i].id;
     });
   })
  //  response.json(buckets);
   var businesses = buckets.reduce((x, y) => {
     return x.concat(y);
   });
   graph.createGraph(businesses).then((G) => {
     response.json(G);
   });
 });
});


api.get('/heatmap', (request, response) => {
  Business.find({}, 'longitude latitude').then((coordinates) => {
    response.json(coordinates);
  })
  .catch((error) => {
    console.error(error);
  });
});

app.use('/api', api);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
