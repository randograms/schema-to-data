const _ = require('lodash');

const Mocker = function ({
  // object
  maxExtraAdditionalProperties = 10,
  minObjectProperties = 0,
  // string
  minStringLength = 0,
  stringLengthRange = 500,
  ...unsupportedOptions
} = {}) {
  const errorMessages = [];

  if (!_.isInteger(minStringLength) || minStringLength < 0) {
    errorMessages.push('"minStringLength" must be a non-negative integer');
  }

  if (!_.isInteger(stringLengthRange) || stringLengthRange < 0) {
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
