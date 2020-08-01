const _ = require('lodash');

const isNonNegativeInteger = (number) => _.isInteger(number) && number >= 0;

const Mocker = function ({
  // object
  maxExtraAdditionalProperties = 10,
  minObjectProperties = 0,
  optionalPropertyPrioritization = 0.8,
  // string
  minStringLength = 0,
  stringLengthRange = 500,
  ...unsupportedOptions
} = {}) {
  const errorMessages = [];

  if (!isNonNegativeInteger(maxExtraAdditionalProperties)) {
    errorMessages.push('"maxExtraAdditionalProperties" must be a non-negative integer');
  }

  if (!isNonNegativeInteger(minObjectProperties)) {
    errorMessages.push('"minObjectProperties" must be a non-negative integer');
  }

  if (
    !_.isNumber(optionalPropertyPrioritization)
    || optionalPropertyPrioritization < 0
    || optionalPropertyPrioritization > 1
  ) {
    errorMessages.push('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
  }

  if (!isNonNegativeInteger(minStringLength)) {
    errorMessages.push('"minStringLength" must be a non-negative integer');
  }

  if (!isNonNegativeInteger(stringLengthRange)) {
    errorMessages.push('"stringLengthRange" must be a non-negative integer');
  }

  const unsupportedOptionKeys = _.keys(unsupportedOptions);
  if (unsupportedOptionKeys.length > 0) {
    errorMessages.push(`Unsupported option(s) "${unsupportedOptionKeys.join(',')}"`);
  }

  if (errorMessages.length > 0) {
    throw Error(`Error(s) setting up defaults: ${errorMessages.join(', ')}`);
  }

  const defaultMinNumber = -100000;
  const defaultMaxNumber = 100000;

  _.assign(this, {
    // TODO: allow these to be configured, and put them under a "defaults" key
    defaultMinNumber,
    defaultMaxNumber,
    numberRange: defaultMaxNumber - defaultMinNumber,
    defaultMinArrayItems: 0,
    defaultArrayLengthRange: 20,
  });

  this.DEFAULTS = {
    // object
    maxExtraAdditionalProperties,
    minObjectProperties,
    optionalPropertyPrioritization,
    // string
    minStringLength,
    stringLengthRange,
  };
};

Mocker.extractSchemaToData = (mocker) => {
  const schemaToData = mocker.schemaToData.bind(mocker);
  schemaToData.getDefaults = () => ({ ...mocker.DEFAULTS });

  return schemaToData;
};

/* eslint-disable global-require */
Mocker.prototype = {
  ...require('./coerceSchema'),
  ...require('./coerceTypes'),
  ...require('./conformSchemaToType'),
  ...require('./generateArray'),
  ...require('./generateBoolean'),
  ...require('./generateData'),
  ...require('./generateDefaultNestedSchema'),
  ...require('./generateNumber'),
  ...require('./generateObject'),
  ...require('./generateString'),
  ...require('./getConformedArrayKeywords'),
  ...require('./getConformedNumberKeywords'),
  ...require('./getConformedObjectKeywords'),
  ...require('./getConformedStringKeywords'),
  ...require('./schemaToData'),
  ...require('./selectType'),
};
/* eslint-enable global-require */

module.exports = {
  Mocker,
  defaultMocker: new Mocker(),
};
