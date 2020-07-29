const _ = require('lodash');
const faker = require('faker');
const { defaultMocker } = require('./lib/mocker');

// TODO: allow these to be configured
const defaultMinStringLength = 0;
const defaultStringLengthRange = 20;
const defaultMinNumber = -100000;
const defaultMaxNumber = 100000;
const numberRange = defaultMaxNumber - defaultMinNumber;
const defaultMinArrayItems = 0;
const defaultArrayLengthRange = 20;
const defaultPotentialExtraProperties = 3;
const supportedInputTypes = ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'];

const coerceSchema = (schema) => {
  if (schema === false) {
    throw Error('Cannot generate data for a "false" literal schema');
  }

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

const generateDefaultNestedSchema = () => ({
  items: { type: ['null', 'string', 'number', 'boolean'] },
  minItems: 0,
  maxItems: 5,
  minProperties: 0,
  maxProperties: 3,
});

const selectType = (typedSchema) => {
  const type = _.sample(typedSchema.type);

  const singleTypedSchema = {
    ...typedSchema,
    type,
  };

  return singleTypedSchema;
};

const createPseudoArraySchema = (singleTypedSchema) => {
  const itemsDefinition = singleTypedSchema.items !== undefined
    ? singleTypedSchema.items
    : lib.generateDefaultNestedSchema(); // eslint-disable-line no-use-before-define

  const isItemsTheFalseSchema = itemsDefinition === false;
  const itemSchemas = isItemsTheFalseSchema ? [] : _.castArray(itemsDefinition);
  const additionalItemsSchema = _.isArray(itemsDefinition) ? lib.generateDefaultNestedSchema() : itemsDefinition; // eslint-disable-line no-use-before-define

  if (isItemsTheFalseSchema && singleTypedSchema.minItems > 0) {
    throw Error('Cannot generate array items for "false" literal items schema and non-zero "minItems"');
  }

  return {
    items: itemSchemas,
    additionalItems: additionalItemsSchema,
    minItems: isItemsTheFalseSchema ? 0 : singleTypedSchema.minItems,
    maxItems: isItemsTheFalseSchema ? 0 : singleTypedSchema.maxItems,
  };
};

const getCoercedItemsSchemas = (pseudoArraySchema) => {
  const {
    items,
    additionalItems,
    minItems = defaultMinArrayItems,
    maxItems = (minItems + defaultArrayLengthRange),
  } = pseudoArraySchema;

  if (maxItems < minItems) {
    throw Error('Cannot generate data for conflicting "minItems" and "maxItems"');
  }

  // assumes defaultMaxArrayItems is always greater than items.length (for now)
  const length = _.random(minItems, maxItems);
  const needsAdditionalItems = length > items.length;

  const itemSchemas = needsAdditionalItems
    ? [...items, ..._.times(length - items.length, () => additionalItems)]
    : items.slice(0, length);

  const coercedItemsSchemas = itemSchemas.map((itemSchema) => {
    const coercedItemSchema = lib.coerceSchema(itemSchema); // eslint-disable-line no-use-before-define
    return coercedItemSchema;
  });

  return coercedItemsSchemas;
};

const createPseudoObjectSchema = (singleTypedSchema) => {
  const propertiesSchemas = { ...singleTypedSchema.properties };
  const requiredPropertyNames = singleTypedSchema.required || [];

  // It's ok if minProperties is less than required.length. It makes error handling easier
  const { minProperties = 0 } = singleTypedSchema;

  const allDefinedPropertyNames = _.keys(propertiesSchemas);
  const optionalPropertyNames = _.difference(allDefinedPropertyNames, requiredPropertyNames);

  const totalProperties = optionalPropertyNames.length + requiredPropertyNames.length;

  const {
    maxProperties = _.max([totalProperties, minProperties]) + defaultPotentialExtraProperties,
  } = singleTypedSchema;

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
    additionalPropertiesSchema: lib.generateDefaultNestedSchema(), // eslint-disable-line no-use-before-define
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

const fillOutPropertiesToGenerate = (pseudoObjectSchema) => {
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
    const additionalPropertyName = lib.generateAdditionalPropertyName(); // eslint-disable-line no-use-before-define

    if (propertiesSchemas[additionalPropertyName] === undefined) {
      propertiesSchemas[additionalPropertyName] = additionalPropertiesSchema; // eslint-disable-line no-use-before-define
      propertyNamesToGenerate.push(additionalPropertyName);
    }
  }
};

const getCoercedPropertiesSchemas = (pseudoObjectSchema) => {
  const {
    propertiesSchemas,
    propertyNamesToGenerate,
  } = pseudoObjectSchema;

  const coercedPropertiesSchemas = _(propertiesSchemas)
    .pick(propertyNamesToGenerate)
    .mapValues(lib.coerceSchema) // eslint-disable-line no-use-before-define
    .value();

  return coercedPropertiesSchemas;
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
      const pseudoArraySchema = createPseudoArraySchema(singleTypedSchema);
      const coercedItemsSchemas = getCoercedItemsSchemas(pseudoArraySchema);

      return {
        ...conformedSchema,
        items: coercedItemsSchemas,
      };
    }
    case 'object': {
      const pseudoObjectSchema = createPseudoObjectSchema(singleTypedSchema);
      guaranteeRequiredPropertiesHaveSchemas(pseudoObjectSchema);
      fillOutPropertiesToGenerate(pseudoObjectSchema);
      const coercedPropertiesSchemas = getCoercedPropertiesSchemas(pseudoObjectSchema);

      return {
        ...conformedSchema,
        properties: coercedPropertiesSchemas,
      };
    }
    default: return conformedSchema;
  }
};

const schemaToData = (schema) => {
  const coercedSchema = coerceSchema(schema);
  const generatedData = defaultMocker.generateData(coercedSchema);

  return generatedData;
};

// this lib object is deprecated and will be replaced with the Mocker api
const lib = {
  coerceSchema,
  coerceTypes,
  generateDefaultNestedSchema,
  selectType,
  createPseudoArraySchema,
  getCoercedItemsSchemas,
  createPseudoObjectSchema,
  guaranteeRequiredPropertiesHaveSchemas,
  generateAdditionalPropertyName,
  fillOutPropertiesToGenerate,
  getCoercedPropertiesSchemas,
  conformSchemaToType,
};

module.exports = {
  schemaToData,
  lib,
};
