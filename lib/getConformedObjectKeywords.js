const _ = require('lodash');
const faker = require('faker');

const createPseudoObjectSchema = function (singleTypedSchema) {
  const { DEFAULTS } = this;
  const propertiesSchemas = { ...singleTypedSchema.properties };
  const requiredPropertyNames = singleTypedSchema.required || [];

  const { additionalProperties, propertyNames, patternProperties } = singleTypedSchema;
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
    propertyNamesSchema: (
      _.isObject(propertyNames)
      && !_.isNull(propertyNames)
      && !_.isArray(propertyNames)
        ? propertyNames
        : null
    ),
    patternPropertiesSchemas: (
      _.isObject(patternProperties)
      && !_.isNull(patternProperties)
      && !_.isArray(patternProperties)
        ? patternProperties
        : null
    ),
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
    patternPropertiesSchemas,
    propertiesSchemas,
    propertyNamesToGenerate,
    additionalPropertiesSchema,
  } = pseudoObjectSchema;

  const patternPropertiesSchemasPairs = _.toPairs(patternPropertiesSchemas);

  propertyNamesToGenerate
    .filter((propertyName) => propertiesSchemas[propertyName] === undefined)
    .forEach((propertyName) => {
      let schemaToUse = additionalPropertiesSchema;

      if (patternPropertiesSchemas !== null) {
        const matchingPair = patternPropertiesSchemasPairs.find(([pattern]) => new RegExp(pattern).test(propertyName));
        if (matchingPair) {
          ([, schemaToUse] = matchingPair);
        }
      }

      propertiesSchemas[propertyName] = schemaToUse;
    });

  // return is for testing purposes only
  return pseudoObjectSchema;
};

const generateAdditionalPropertyName = () => faker.lorem.word();

const fillOutPropertiesToGenerate = function (pseudoObjectSchema) {
  const {
    propertyNamesSchema,
    patternPropertiesSchemas,
    propertiesSchemas,
    propertyNamesToGenerate,
    shuffledOptionalPropertyNames,
    additionalPropertiesSchema,
    minProperties,
    maxProperties,
  } = pseudoObjectSchema;

  const patternPropertiesSchemasPairs = _.toPairs(patternPropertiesSchemas);
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
      const additionalPropertyName = propertyNamesSchema === null
        ? this.generateAdditionalPropertyName()
        : this.schemaToData({
          ...propertyNamesSchema,
          type: 'string',
        });

      let schemaToUse = additionalPropertiesSchema;
      if (patternPropertiesSchemas !== null) {
        const matchingPair = patternPropertiesSchemasPairs.find(
          ([pattern]) => new RegExp(pattern).test(additionalPropertyName),
        );
        if (matchingPair) {
          ([, schemaToUse] = matchingPair);
        }
      }

      if (propertiesSchemas[additionalPropertyName] === undefined) {
        propertiesSchemas[additionalPropertyName] = schemaToUse;
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
