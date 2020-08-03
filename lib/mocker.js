const _ = require('lodash');

const Mocker = function ({
  // array
  arrayLengthRange = 20,
  maxExtraAdditionalItems = 10,
  minArrayItems = 0,
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

  _.forEach(
    {
      arrayLengthRange,
      maxExtraAdditionalItems,
      minArrayItems,
      maxExtraAdditionalProperties,
      minObjectProperties,
      minStringLength,
      stringLengthRange,
    },
    (optionValue, optionName) => {
      const isNonNegativeInteger = _.isInteger(optionValue) && optionValue >= 0;
      if (!isNonNegativeInteger) {
        errorMessages.push(`"${optionName}" must be a non-negative integer`);
      }
    },
  );

  if (
    !_.isNumber(optionalPropertyPrioritization)
    || optionalPropertyPrioritization < 0
    || optionalPropertyPrioritization > 1
  ) {
    errorMessages.push('"optionalPropertyPrioritization" must be a number in the range [0, 1]');
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
  });

  this.DEFAULTS = {
    // array
    arrayLengthRange,
    maxExtraAdditionalItems,
    minArrayItems,
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
