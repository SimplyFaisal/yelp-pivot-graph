const express = require('express');
const app = express();
const morgan = require('morgan');
const graph = require('./graph');
const util = require('util');
const credentials = require('./credentials.json');


app.use(morgan('combined'));

const uri = util.format('mongodb://%s:%s@ds139847.mlab.com:39847/yelp',
  credentials.username, credentials.password);

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

api.get('/heatmap', (request, response) => {
  Business.find({}, 'longitude latitude').then((coordinates) => {
    response.json(coordinates);
  })
  .catch((error) => {
    console.error(error);
  });
});

api.post('/yelp', (request, response) => {
  response.send('sucesss');
});

app.use('/api', api);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
