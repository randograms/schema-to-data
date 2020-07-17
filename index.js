const _ = require('lodash');
const faker = require('faker');

// TODO: allow these to be configured
const defaultMinStringLength = 0;
const stringLengthRange = 20;
const defaultMinNumber = -100000;
const defaultMaxNumber = 100000;
const numberRange = defaultMaxNumber - defaultMinNumber;
const defaultMinArrayItems = 0;
const defaultMaxArrayItems = 5;
const optionalPropertyChance = 0.8;
const supportedInputTypes = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

const coerceSchema = (schema) => {
  const typedSchema = coerceTypes(schema); // eslint-disable-line no-use-before-define
  const conformedSchema = conformSchemaToType(typedSchema); // eslint-disable-line no-use-before-define
  return conformedSchema;
};

const coerceTypes = (schema) => {
  const inputTypes = _.castArray(schema.type);
  let coercedTypes = _.intersection(inputTypes, supportedInputTypes);

  const numberIndex = coercedTypes.indexOf('number');
  const hasNumber = numberIndex !== -1;
  if (hasNumber) {
    const hasInteger = coercedTypes.includes('integer');
    const expandedTypes = hasInteger ? ['decimal'] : ['decimal', 'integer'];
    coercedTypes.splice(numberIndex, 1, ...expandedTypes);
  }

  if (_.isEmpty(coercedTypes)) {
    coercedTypes = ['null', 'string', 'decimal', 'integer', 'boolean', 'array', 'object'];
  }

  const typedSchema = {
    ...schema,
    type: coercedTypes,
  };

  return typedSchema;
};

const conformSchemaToType = (typedSchema) => {
  const type = _.sample(typedSchema.type);

  const singleTypedSchema = { type };

  switch (type) {
    case 'string': {
      const minLength = typedSchema.minLength || defaultMinStringLength;
      const maxLength = typedSchema.maxLength || (minLength + stringLengthRange);

      return {
        ...singleTypedSchema,
        minLength,
        maxLength,
      };
    }
    case 'decimal':
    case 'integer': {
      let {
        minimum,
        maximum,
      } = typedSchema;

      if (minimum === undefined && maximum === undefined) {
        minimum = defaultMinNumber;
        maximum = defaultMaxNumber;
      } else if (minimum !== undefined && maximum === undefined) {
        maximum = (minimum + numberRange);
      } else if (minimum === undefined && maximum !== undefined) {
        minimum = maximum - numberRange;
      }

      if (type === 'integer') {
        minimum = Math.ceil(minimum);
        maximum = Math.floor(maximum);
      }

      return {
        ...singleTypedSchema,
        minimum,
        maximum,
      };
    }
    case 'array': {
      const itemsDefinition = typedSchema.items || {};

      let itemSchemas;
      if (_.isArray(itemsDefinition)) {
        const length = _.random(defaultMinArrayItems, itemsDefinition.length);
        itemSchemas = itemsDefinition.slice(0, length);
      } else {
        const itemSchema = itemsDefinition;
        const length = _.random(defaultMinArrayItems, defaultMaxArrayItems);
        itemSchemas = _.times(length, () => itemSchema);
      }

      const coercedItemSchemas = itemSchemas.map(lib.coerceSchema); // eslint-disable-line no-use-before-define

      return {
        ...singleTypedSchema,
        items: coercedItemSchemas,
      };
    }
    case 'object': {
      const propertySchemasCopy = { ...typedSchema.properties } || {};
      const required = typedSchema.required || [];

      required.forEach((propertyName) => {
        propertySchemasCopy[propertyName] = propertySchemasCopy[propertyName] || {};
      });

      const coercedPropertySchemas = _.mapValues(propertySchemasCopy, lib.coerceSchema); // eslint-disable-line no-use-before-define

      return {
        ...singleTypedSchema,
        properties: coercedPropertySchemas,
        required,
      };
    }
    default: return singleTypedSchema;
  }
};

const generateData = (singleTypedSchema) => {
  /* eslint-disable no-use-before-define */
  switch (singleTypedSchema.type) {
    case 'null': return null;
    case 'string': return lib.generateString(singleTypedSchema);
    case 'decimal': return lib.generateNumber(singleTypedSchema);
    case 'integer': return lib.generateNumber(singleTypedSchema);
    case 'boolean': return lib.generateBoolean();
    case 'array': return lib.generateArray(singleTypedSchema);
    case 'object': return lib.generateObject(singleTypedSchema);
    default: throw Error(`Expected schema to have a known type but got "${singleTypedSchema.type}"`);
  }
  /* eslint-enable no-use-before-define */
};

const generateString = (stringSchema) => {
  // minLength and maxLength will be guaranteed to exist
  const { minLength, maxLength } = stringSchema;

  if (maxLength < minLength) {
    throw Error('Cannot generate data for conflicting "minLength" and "maxLength"');
  }

  const stringLength = _.random(minLength, maxLength);

  let generatedLength = 0;
  const randomWords = [];

  while (generatedLength < stringLength) {
    let randomWord = faker.lorem.word();
    generatedLength += randomWord.length;

    if (generatedLength > stringLength) {
      const numCharsToRemove = generatedLength - stringLength;
      const numCharsToKeep = randomWord.length - numCharsToRemove;

      randomWord = randomWord.substr(0, numCharsToKeep);
      generatedLength -= numCharsToRemove;
    }

    randomWords.push(randomWord);
  }

  const randomString = randomWords.join('');
  return randomString;
};

const generateNumber = (numberSchema) => {
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

const generateBoolean = () => faker.random.boolean();

const generateArray = (arraySchema) => {
  // all array schemas will have been coerced to a tuple array schema
  const { items } = arraySchema;
  return items.map(lib.generateData); // eslint-disable-line no-use-before-define
};

const generateObject = (objectSchema) => {
  // properties will have been coerced to always have a schema for required properties
  const { properties, required: requiredPropertyNames } = objectSchema;

  const allPropertyNames = _.keys(properties);
  const optionalPropertyNames = _.difference(allPropertyNames, requiredPropertyNames);
  const optionalPropertyNamesToGenerate = _.filter(optionalPropertyNames, () => Math.random() < optionalPropertyChance);

  const mockObject = _(properties)
    .pick([...requiredPropertyNames, ...optionalPropertyNamesToGenerate])
    .mapValues(lib.generateData) // eslint-disable-line no-use-before-define
    .value();

  return mockObject;
};

const schemaToData = (schema) => {
  const coercedSchema = coerceSchema(schema);
  const generatedData = generateData(coercedSchema);

  return generatedData;
};

const lib = {
  coerceSchema,
  coerceTypes,
  conformSchemaToType,
  generateData,
  generateString,
  generateNumber,
  generateBoolean,
  generateArray,
  generateObject,
};

module.exports = {
  schemaToData,
  lib,
};
