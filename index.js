const _ = require('lodash');
const faker = require('faker');

// TODO: allow these to be configured
const defaultMinStringLength = 0;
const defaultStringLengthRange = 20;
const defaultMinNumber = -100000;
const defaultMaxNumber = 100000;
const numberRange = defaultMaxNumber - defaultMinNumber;
const defaultMinArrayItems = 0;
const defaultArrayLengthRange = 20;
const optionalPropertyChance = 0.8;
const supportedInputTypes = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

const coerceSchema = (schema) => {
  /* eslint-disable no-use-before-define */
  const typedSchema = coerceTypes(schema);
  const singleTypedSchema = selectType(typedSchema);
  const conformedSchema = conformSchemaToType(singleTypedSchema);
  /* eslint-enable no-use-before-define */

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

const selectType = (typedSchema) => {
  const type = _.sample(typedSchema.type);

  const singleTypedSchema = {
    ...typedSchema,
    type,
  };

  if (type === 'array') {
    const itemsDefinition = typedSchema.items || {};

    const itemSchemas = _.castArray(itemsDefinition);
    const additionalItemsSchema = _.isArray(itemsDefinition) ? {} : itemsDefinition;

    singleTypedSchema.items = itemSchemas;
    singleTypedSchema.additionalItems = additionalItemsSchema;
  }

  return singleTypedSchema;
};

const conformSchemaToType = (singleTypedSchema) => {
  const { type } = singleTypedSchema;
  const conformedSchema = { type };

  switch (type) {
    case 'string': {
      const minLength = singleTypedSchema.minLength || defaultMinStringLength;
      const maxLength = singleTypedSchema.maxLength || (minLength + defaultStringLengthRange);

      return {
        ...conformedSchema,
        minLength,
        maxLength,
      };
    }
    case 'decimal':
    case 'integer': {
      let {
        minimum,
        maximum,
      } = singleTypedSchema;

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
        ...conformedSchema,
        minimum,
        maximum,
      };
    }
    case 'array': {
      // items is guaranteed to be an array
      // additionalItems is guaranteed to be a schema
      const {
        items,
        additionalItems,
        minItems = defaultMinArrayItems,
        maxItems = (minItems + defaultArrayLengthRange),
      } = singleTypedSchema;

      // assumes defaultMaxArrayItems is always greater than items.length (for now)
      const length = _.random(minItems, maxItems);
      const needsAdditionalItems = length > items.length;

      const itemSchemas = needsAdditionalItems
        ? [...items, ..._.times(length - items.length, () => additionalItems)]
        : items.slice(0, length);
      const coercedItemSchemas = itemSchemas.map((itemSchema) => {
        const coercedItemSchema = lib.coerceSchema(itemSchema); // eslint-disable-line no-use-before-define
        return coercedItemSchema;
      });
      return {
        ...conformedSchema,
        items: coercedItemSchemas,
      };
    }
    case 'object': {
      const propertySchemasCopy = { ...singleTypedSchema.properties } || {};
      const required = singleTypedSchema.required || [];

      required.forEach((propertyName) => {
        propertySchemasCopy[propertyName] = propertySchemasCopy[propertyName] || {};
      });

      const coercedPropertySchemas = _.mapValues(propertySchemasCopy, lib.coerceSchema); // eslint-disable-line no-use-before-define

      return {
        ...conformedSchema,
        properties: coercedPropertySchemas,
        required,
      };
    }
    default: return conformedSchema;
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
  selectType,
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
