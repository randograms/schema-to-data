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
const optionalPropertyChance = .8;

const coerceSchema = (schema) => {
  const typedSchema = coerceTypes(schema);
  const conformedSchema = conformSchemaToType(typedSchema);
  return conformedSchema;
}

const coerceTypes = (schema) => {
  const typedSchema = { ...schema };

  if (_.isString(schema.type)) typedSchema.type = [schema.type];
  else if (_.isArray(schema.type)) typedSchema.type = schema.type;
  else typedSchema.type = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

  return typedSchema;
};

const getSchemaKeysForType = (type) => {
  switch(type) {
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
  type = type || _.sample(typedSchema.type);

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

const generateString = () => {
  return faker.lorem.word();
};

const generateNumber = () => {
  const isFloat = Math.random() < numberIntegerChance;

  return _.random(minNumber, maxNumber, isFloat)
};

const generateInteger = () => {
  return _.random(minInteger, maxInteger);
};

const generateBoolean = () => {
  return faker.random.boolean();
};

const generateArray = (arraySchema) => {
  // all array schemas will have been coerced to a tuple array schema
  const { items } = arraySchema;
  return items.map(generateData);
};

const generateObject = (objectSchema) => {
  const { properties, required: requiredPropertyNames } = objectSchema;

  const allPropertyNames = _.keys(properties);
  const optionalPropertyNames = _.difference(allPropertyNames, requiredPropertyNames);
  const optionalPropertyNamesToGenerate = _.filter(optionalPropertyNames, () => Math.random() < optionalPropertyChance);

  const mockObject = _(properties)
    .pick([...requiredPropertyNames, ...optionalPropertyNamesToGenerate])
    .mapValues(generateData)
    .value();

  return mockObject;
};

const generateData = (singleTypedSchema) => {
  switch(singleTypedSchema.type) {
    case 'null': return null;
    case 'string': return generateString();
    case 'number': return generateNumber();
    case 'integer': return generateInteger();
    case 'boolean': return generateBoolean();
    case 'array': return generateArray(singleTypedSchema);
    case 'object': return generateObject(singleTypedSchema);
    default: throw Error(`Expected schema to have a known type but got "${singleTypedSchema.type}"`);
  }
};

const schemaToData = (schema) => {
  const coercedSchema = coerceSchema(schema);
  const generatedData = generateData(coercedSchema);

  return generatedData;
};

module.exports = schemaToData;
