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

  if (_.isString(schema.type)) {
    typedSchema.type = [schema.type];
  } else if (_.isArray(schema.type) && _.isEmpty(schema.type)) {
    throw Error('Schema "type" must not be an empty array');
  } else if (!_.isArray(schema.type)) {
    typedSchema.type = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];
  }

  return typedSchema;
};

const conformSchemaToType = (typedSchema, type) => {
  const singleTypedSchema = { ...typedSchema };

  if (type === undefined) {
    singleTypedSchema.type = _.sample(typedSchema.type);
  } else {
    throw Error('Unhandled scenario')
  }

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
    case 'array': return generateArray();
    default: return generateObject();
  }
};

const schemaToData = (schema) => {
  const typedSchema = coerceTypes(schema);
  const singleTypedSchema = conformSchemaToType(typedSchema, undefined);
  const generatedData = generateData(singleTypedSchema);

  return generatedData;
};

module.exports = schemaToData;
