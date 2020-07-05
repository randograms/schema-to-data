const _ = require('lodash');
const faker = require('faker');

// TODO: allow these to be configured
const minInteger = -100000;
const maxInteger = 100000;
const minNumber = minInteger;
const maxNumber = maxInteger;
const numberIntegerChance = 0.5;

const coerceTypes = (schema) => {
  const typedSchema = { ...schema };

  if (_.isString(schema.type)) typedSchema.type = [schema.type];
  else if (_.isArray(schema.type)) typedSchema.type = schema.type;
  else typedSchema.type = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

  return typedSchema;
};

const conformSchemaToType = (typedSchema, type) => {
  type = type || _.sample(typedSchema.type);
  const singleTypedSchema = { ...typedSchema, type };
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

const generateArray = () => {
  return [];
};

const generateObject = () => {
  return {};
};

const generateData = (singleTypedSchema) => {
  switch(singleTypedSchema.type) {
    case 'null': return null;
    case 'string': return generateString();
    case 'number': return generateNumber();
    case 'integer': return generateInteger();
    case 'boolean': return generateBoolean();
    case 'object': return generateObject();
    default: throw Error('Expected schema to have been coerced to a single known type');
  }
};

const schemaToData = (schema) => {
  const typedSchema = coerceTypes(schema);
  const singleTypedSchema = conformSchemaToType(typedSchema, undefined);
  const generatedData = generateData(singleTypedSchema);

  return generatedData;
};

module.exports = schemaToData;
