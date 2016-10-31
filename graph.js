'use strict';
var graphlib = require('graphlib');
var Promise = require('bluebird');

exports.createGraph = function(businesses) {
  return new Promise((resolve, reject) => {
    var G = new graphlib.Graph({directed: false});
    businesses.forEach((b) => {
      // Every restaurant has the string 'Restaurants' in its categories list
      // so we have to remove it else the resultant graph will be a hairball.
      b.categories = new Set(b.categories.filter(x => x != 'Restaurants'));
      G.setNode(b.business_id, b);
    });
    businesses.forEach((x) => {
      businesses.forEach((y) => {
        if (x.business_id != y.business_id) {
          var intersection = Array.from(x.categories)
                .filter(category => y.categories.has(category));
          if (intersection.length >= 2) {
            G.setEdge(x.business_id, y.business_id);
          }
        }
      });
    });
    resolve(graphlib.json.write(G));
  });
};
