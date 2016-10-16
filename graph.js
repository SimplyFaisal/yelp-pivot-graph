'use strict';
var graphlib = require('graphlib');
var Promise = require('bluebird');

exports.createGraph = function(Review, businesses) {
  return new Promise((resolve, reject) => {
    var G = new graphlib.Graph({directed: false});
    var businessToUserSetMap = new Map();
    // Add all the businesses to the graph as nodes.
    businesses.forEach((b) => {
      businessToUserSetMap.set(b.business_id, new Set());
      G.setNode(b.business_id, b);
    });
    var businessIds = businesses.map(b => b.business_id);
    console.log(businessIds);
    Review.find({business_id: {$in: businessIds}}).then((reviews) => {
          console.log('=>>>>',reviews);
          reviews.forEach((review) => {
            if (businessToUserSetMap.has(review.business_id)) {
              console.log('putting');
              businessToUserSetMap.get(review.business_id).add(review.user_id);
            }
          });
          console.log('done streaming');
          for (let businessId of businessToUserSetMap.keys()) {
            var set = businessToUserSetMap.get(businessId);
            for (let otherId of businessToUserSetMap.keys()) {
              if (businessId == otherId) {
                return;
              }
              var otherSet = businessToUserSetMap.get(otherId);
              var intersection  = set.filter(x => otherSet.has(x));
              intersection.forEach(x => G.setEdge(businessId, otherId, {user_id: x}));
            };
          };
          resolve(graphlib.json.write(G));
        })
        .catch((error) => {
          reject(error);
        });
      });
};
