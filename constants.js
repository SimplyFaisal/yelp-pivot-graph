const enumify = require('enumify');
import * as d3 from "d3";

class DataType extends enumify.Enum {}

DataType.initEnum({
  QUANTITATIVE : {},
  ORDINAL: {},
  NOMINAL: {}
});


class AttributeType extends enumify.Enum {}

AttributeType.initEnum({
  STARS: {
    label: 'Stars',
    value: 'STARS',
    type: DataType.ORDINAL,
    domain: (data) => [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5],
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d.value.stars;
    }
  },
  CATEGORIES: {
    label: 'Categories',
    value: 'CATEGORIES',
    type: DataType.ORDINAL,
    domain: (data) => data,
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d;
    }
  },
  REVIEW_COUNT: {
    label: 'Review Count',
    value: 'REVIEW_COUNT',
    domain: (data) =>  {
      data.sort(d3.ascending);
      return d3.range(0, 100, 10)
        .map(i => d3.quantile(data, i, x => x.value.review_count));
    },
    scale: () => {
      return d3.scaleQuantile();
    },
    f: (d) => {
      return d.value.review_count;
    }
  },
  ATTIRE: {
    label: 'Attire',
    value: 'ATTIRE',
    type: DataType.ORDINAL,
    domain: (data) => [ "casual", "dressy", "formal", 'unknown'],
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d.value.attributes.Attire || 'unknown';
    }
  },
  PRICE_RANGE: {
    label: 'Price Range',
    value: 'PRICE_RANGE',
    type: DataType.ORDINAL,
    domain: (data) => [1,2,3,4, 'unknown'],
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d.value.attributes['Price Range'] || 'unknown';
    }
  },
  DELIVERY: {
    label: 'Delivery',
    value: 'DELIVERY',
    type: DataType.ORDINAL,
    domain: (data) => ['yes', 'no'],
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d.value.attributes.Delivery ? 'yes' : 'no';
    }
  },
  NOISE_LEVEL: {
    label: 'Noise Level',
    value: 'NOISE_LEVEL',
    type: DataType.ORDINAL,
    domain: (data) => [ "average", "loud", "quiet", "very_loud" , 'unknown'],
    scale: () => {
      return d3.scalePoint();
    },
    f: (d) => {
      return d.value.attributes['Noise Level'] || 'unknown';
    }
  }
});

class ActionType extends enumify.Enum {}

ActionType.initEnum({
  SET_YAXIS_ATTRIBUTE: {},
  SET_XAXIS_ATTRIBUTE: {},
  SET_LOCATIONS: {},
  SET_GRAPH: {},
  ADD_LOCATION: {},
  REMOVE_LOCATION: {},
  UPDATE_LOCATION: {},
  SET_BUSINESSES: {}
});

exports.AttributeType = AttributeType;
exports.ActionType = ActionType;
exports.DataType = DataType;
