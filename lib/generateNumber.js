const _ = require('lodash');

module.exports.generateNumber = (numberSchema) => {
  // schema is guaranteed to have a "decimal" or "integer" type
  // minimum and maximum are guaranteed to exist
  const {
    type,
    minimum,
    maximum,
  } = numberSchema;
  const isDecimal = type === 'decimal';

  if (maximum < minimum) {
    throw Error('Cannot generate data for conflicting "minimum" and "maximum"');
  }

  return _.random(minimum, maximum, isDecimal);
};
