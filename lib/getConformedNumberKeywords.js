const _ = require('lodash');

module.exports.getConformedNumberKeywords = function (singleTypedSchema) {
  const { DEFAULTS } = this;
  const { type } = singleTypedSchema;
  let {
    minimum,
    maximum,
  } = singleTypedSchema;

  if (!_.isNumber(minimum) && !_.isNumber(maximum)) {
    minimum = DEFAULTS.minNumber;
    maximum = DEFAULTS.maxNumber;
  } else if (_.isNumber(minimum) && !_.isNumber(maximum)) {
    maximum = Math.max(minimum, DEFAULTS.maxNumber);
  } else if (!_.isNumber(minimum) && _.isNumber(maximum)) {
    minimum = Math.min(maximum, DEFAULTS.minNumber);
  }

  if (type === 'integer') {
    minimum = Math.ceil(minimum);
    maximum = Math.floor(maximum);
  }

  if (maximum < minimum) {
    throw Error('Cannot generate data for conflicting "minimum" and "maximum"');
  }

  return {
    minimum,
    maximum,
  };
};
