const _ = require('lodash');
const faker = require('faker');

const createPseudoObjectSchema = function (singleTypedSchema) {
  const { DEFAULTS } = this;
  const propertiesSchemas = { ...singleTypedSchema.properties };
  const requiredPropertyNames = singleTypedSchema.required || [];

  const { additionalProperties } = singleTypedSchema;
  const isAdditionalPropertiesTheFalseSchema = additionalProperties === false;
  const isAdditionalPropertiesSet = (
    _.isBoolean(additionalProperties)
    || (!_.isNull(additionalProperties) && _.isObject(additionalProperties))
  );

  let additionalPropertiesSchema;
  if (isAdditionalPropertiesTheFalseSchema) {
    additionalPropertiesSchema = null;
  } else if (isAdditionalPropertiesSet) {
    additionalPropertiesSchema = additionalProperties;
  } else {
    additionalPropertiesSchema = this.generateDefaultNestedSchema();
  }

  let { minProperties } = singleTypedSchema;

  const isUsingDefaultMinProperties = !_.isNumber(minProperties);
  if (isUsingDefaultMinProperties) {
    minProperties = DEFAULTS.minObjectProperties;
  }

  const allDefinedPropertyNames = _.keys(propertiesSchemas);
  const optionalPropertyNames = _.difference(allDefinedPropertyNames, requiredPropertyNames);

  const totalProperties = optionalPropertyNames.length + requiredPropertyNames.length;

  let {
    maxProperties = _.max([totalProperties, minProperties]) + DEFAULTS.maxExtraAdditionalProperties,
  } = singleTypedSchema;

  if (isAdditionalPropertiesTheFalseSchema) {
    maxProperties = allDefinedPropertyNames.length;
  }

  if (isUsingDefaultMinProperties && minProperties > maxProperties) {
    minProperties = maxProperties;
  }

  if (maxProperties < requiredPropertyNames.length) {
    throw Error('Cannot generate data for conflicting "required" and "maxProperties"');
  }

  if (
    isAdditionalPropertiesTheFalseSchema
    && allDefinedPropertyNames.length < (requiredPropertyNames.length + optionalPropertyNames.length)
  ) {
    throw Error('Cannot generate data for conflicting "required" property without a schema and "false" literal "additionalProperties"'); // eslint-disable-line max-len
  }

  if (isAdditionalPropertiesTheFalseSchema && minProperties > allDefinedPropertyNames.length) {
    throw Error('Cannot generate data for conflicting "minProperties" and "false" literal "additionalProperties"');
  }

  if (minProperties > maxProperties) {
    throw Error('Cannot generate data for conflicting "minProperties" and "maxProperties"');
  }

  return {
    propertiesSchemas,
    propertyNamesToGenerate: [...requiredPropertyNames],
    shuffledOptionalPropertyNames: _.shuffle(optionalPropertyNames),
    additionalPropertiesSchema,
    minProperties: Math.max(minProperties, requiredPropertyNames.length),
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

  // return is for testing purposes only
  return pseudoObjectSchema;
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

  while (propertyNamesToGenerate.length < size) {
    const useOptionalProperty = (
      additionalPropertiesSchema === null
      || (
        shuffledOptionalPropertyNames.length > 0
        && Math.random() < this.DEFAULTS.optionalPropertyPrioritization
      )
    );

    if (useOptionalProperty) {
      const optionalPropertyName = shuffledOptionalPropertyNames.shift();
      propertyNamesToGenerate.push(optionalPropertyName);
    } else {
      const additionalPropertyName = this.generateAdditionalPropertyName();

      if (propertiesSchemas[additionalPropertyName] === undefined) {
        propertiesSchemas[additionalPropertyName] = additionalPropertiesSchema;
        propertyNamesToGenerate.push(additionalPropertyName);
      }
    }
  }

  // return is for testing purposes only
  return pseudoObjectSchema;
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
