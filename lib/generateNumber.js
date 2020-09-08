const _ = require('lodash');

module.exports.generateNumber = (numberSchema) => {
  const {
    type,
    minimum,
    maximum,
  } = numberSchema;
  const isDecimal = type === 'decimal';

  return _.random(minimum, maximum, isDecimal);
};
