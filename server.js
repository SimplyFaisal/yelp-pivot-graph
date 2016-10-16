const express = require('express');
const app = express();
const morgan = require('morgan');
const graph = require('./graph');

app.use(morgan('combined'));

const db = require('monk')('localhost/yelp')
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
  Business.find({'city': {$in: locations}}).then((businesses) => {
    graph.createGraph(Review, businesses).then((G) => {
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

app.use('/api', api);
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
