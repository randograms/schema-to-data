const _ = require('lodash');
const faker = require('faker');

// TODO: allow these to be configured
const minInteger = -100000;
const maxInteger = 100000;
const minNumber = minInteger;
const maxNumber = maxInteger;
const numberIntegerChance = 0.5;
const minArrayItems = 0;
const maxArrayItems = 5;
const optionalPropertyChance = 0.8;

const coerceSchema = (schema) => {
  const typedSchema = coerceTypes(schema); // eslint-disable-line no-use-before-define
  const conformedSchema = conformSchemaToType(typedSchema); // eslint-disable-line no-use-before-define
  return conformedSchema;
};

const coerceTypes = (schema) => {
  const typedSchema = { ...schema };

  if (_.isString(schema.type)) typedSchema.type = [schema.type];
  else if (_.isArray(schema.type)) typedSchema.type = [...schema.type];
  else typedSchema.type = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

  return typedSchema;
};

const getSchemaKeysForType = (type) => {
  switch (type) {
    case 'null': return [
    ];
    case 'string': return [
    ];
    case 'number': return [
    ];
    case 'integer': return [
    ];
    case 'boolean': return [
    ];
    case 'array': return [
      'items',
    ];
    case 'object': return [
      'properties',
      'required',
    ];
    default: return [];
  }
};

const conformSchemaToType = (typedSchema, type) => {
  type = type || _.sample(typedSchema.type); // eslint-disable-line no-param-reassign

  const singleTypedSchema = {
    type,
    ..._.pick(typedSchema, getSchemaKeysForType(type)),
  };

  if (type === 'array') {
    const itemsDefinition = singleTypedSchema.items || {};

    let itemsSchemas;
    if (_.isArray(itemsDefinition)) itemsSchemas = itemsDefinition;
    else {
      const itemSchema = itemsDefinition;
      const length = _.random(minArrayItems, maxArrayItems);
      itemsSchemas = _.times(length, () => itemSchema);
    }

    singleTypedSchema.items = itemsSchemas.map(coerceSchema);
  } else if (type === 'object') {
    const propertyDefinitions = singleTypedSchema.properties || {};
    singleTypedSchema.required = singleTypedSchema.required || [];

    singleTypedSchema.properties = _.mapValues(propertyDefinitions, coerceSchema);
  }

  singleTypedSchema.type = type;
  return singleTypedSchema;
};

const generateData = (singleTypedSchema) => {
  /* eslint-disable no-use-before-define */
  switch (singleTypedSchema.type) {
    case 'null': return null;
    case 'string': return lib.generateString();
    case 'number': return lib.generateNumber();
    case 'integer': return lib.generateInteger();
    case 'boolean': return lib.generateBoolean();
    case 'array': return lib.generateArray(singleTypedSchema);
    case 'object': return lib.generateObject(singleTypedSchema);
    default: throw Error(`Expected schema to have a known type but got "${singleTypedSchema.type}"`);
  }
  /* eslint-enable no-use-before-define */
};

const generateString = () => {
  const randomWord = faker.lorem.word();
  return randomWord;
};

const generateNumber = () => {
  const isFloat = Math.random() < numberIntegerChance;

  return _.random(minNumber, maxNumber, isFloat);
};

const generateInteger = () => {
  const randomInteger = _.random(minInteger, maxInteger);
  return randomInteger;
};

const generateBoolean = () => faker.random.boolean();

const generateArray = (arraySchema) => {
  // all array schemas will have been coerced to a tuple array schema
  const { items } = arraySchema;
  return items.map(lib.generateData); // eslint-disable-line no-use-before-define
};

const generateObject = (objectSchema) => {
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
  coerceTypes,
  generateData,
  generateString,
  generateNumber,
  generateInteger,
  generateBoolean,
  generateArray,
  generateObject,
};

module.exports = {
  schemaToData,
  lib,
};
