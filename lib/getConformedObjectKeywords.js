const _ = require('lodash');
const faker = require('faker');

const createPseudoObjectSchema = function (singleTypedSchema) {
  const { DEFAULTS } = this;
  const propertiesSchemas = { ...singleTypedSchema.properties };
  const requiredPropertyNames = singleTypedSchema.required || [];

  // It's ok if minProperties is less than required.length. It makes error handling easier
  let { minProperties } = singleTypedSchema;

  const isUsingDefaultMinProperties = !_.isNumber(minProperties);
  if (isUsingDefaultMinProperties) {
    minProperties = DEFAULTS.minObjectProperties;
  }

  const allDefinedPropertyNames = _.keys(propertiesSchemas);
  const optionalPropertyNames = _.difference(allDefinedPropertyNames, requiredPropertyNames);

  const totalProperties = optionalPropertyNames.length + requiredPropertyNames.length;

  const {
    maxProperties = _.max([totalProperties, minProperties]) + DEFAULTS.maxExtraAdditionalProperties,
  } = singleTypedSchema;

  if (isUsingDefaultMinProperties && minProperties > maxProperties) {
    minProperties = maxProperties;
  }

  if (maxProperties < requiredPropertyNames.length) {
    throw Error('Cannot generate data for conflicting "required" and "maxProperties"');
  }

  if (minProperties > maxProperties) {
    throw Error('Cannot generate data for conflicting "minProperties" and "maxProperties"');
  }

  return {
    propertiesSchemas,
    propertyNamesToGenerate: [...requiredPropertyNames],
    shuffledOptionalPropertyNames: _.shuffle(optionalPropertyNames),
    additionalPropertiesSchema: this.generateDefaultNestedSchema(),
    minProperties,
    maxProperties,
  };
};

const guaranteeRequiredPropertiesHaveSchemas = (pseudoObjectSchema) => {
  const {
    propertiesSchemas,
    propertyNamesToGenerate,
    additionalPropertiesSchema,
  } = pseudoObjectSchema;

  propertyNamesToGenerate.forEach((propertyName) => {
    propertiesSchemas[propertyName] = propertiesSchemas[propertyName] !== undefined
      ? propertiesSchemas[propertyName]
      : additionalPropertiesSchema;
  });
};

const generateAdditionalPropertyName = () => faker.lorem.word();

const fillOutPropertiesToGenerate = function (pseudoObjectSchema) {
  const {
    propertiesSchemas,
    propertyNamesToGenerate,
    shuffledOptionalPropertyNames,
    additionalPropertiesSchema,
    minProperties,
    maxProperties,
  } = pseudoObjectSchema;

  const size = _.random(minProperties, maxProperties);

  while (propertyNamesToGenerate.length < size && shuffledOptionalPropertyNames.length > 0) {
    const optionalPropertyName = shuffledOptionalPropertyNames.shift();
    propertyNamesToGenerate.push(optionalPropertyName);
  }

  while (propertyNamesToGenerate.length < size) {
    const additionalPropertyName = this.generateAdditionalPropertyName();

    if (propertiesSchemas[additionalPropertyName] === undefined) {
      propertiesSchemas[additionalPropertyName] = additionalPropertiesSchema;
      propertyNamesToGenerate.push(additionalPropertyName);
    }
  }
};

const getCoercedPropertiesSchemas = function (pseudoObjectSchema) {
  const {
    propertiesSchemas,
    propertyNamesToGenerate,
  } = pseudoObjectSchema;

  const coercedPropertiesSchemas = _(propertiesSchemas)
    .pick(propertyNamesToGenerate)
    .mapValues((coercedPropertySchema) => this.coerceSchema(coercedPropertySchema))
    .value();

  return coercedPropertiesSchemas;
};

const getConformedObjectKeywords = function (singleTypedSchema) {
  const pseudoObjectSchema = this.createPseudoObjectSchema(singleTypedSchema);
  this.guaranteeRequiredPropertiesHaveSchemas(pseudoObjectSchema);
  this.fillOutPropertiesToGenerate(pseudoObjectSchema);
  const coercedPropertiesSchemas = this.getCoercedPropertiesSchemas(pseudoObjectSchema);

  return {
    properties: coercedPropertiesSchemas,
  };
};

module.exports = {
  createPseudoObjectSchema,
  guaranteeRequiredPropertiesHaveSchemas,
  generateAdditionalPropertyName,
  fillOutPropertiesToGenerate,
  getCoercedPropertiesSchemas,
  getConformedObjectKeywords,
};
