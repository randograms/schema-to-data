const _ = require('lodash');
const faker = require('faker');

const generateDefaultNestedSchema = () => ({
  items: { type: ['null', 'string', 'number', 'boolean'] },
  minItems: 0,
  maxItems: 5,
  minProperties: 0,
  maxProperties: 3,
});

const createPseudoArraySchema = function (singleTypedSchema) {
  const itemsDefinition = singleTypedSchema.items !== undefined
    ? singleTypedSchema.items
    : this.generateDefaultNestedSchema();

  const isItemsTheFalseSchema = itemsDefinition === false;
  const itemSchemas = isItemsTheFalseSchema ? [] : _.castArray(itemsDefinition);
  const additionalItemsSchema = _.isArray(itemsDefinition) ? this.generateDefaultNestedSchema() : itemsDefinition;

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

const getCoercedItemsSchemas = function (pseudoArraySchema) {
  const {
    items,
    additionalItems,
    minItems = this.defaultMinArrayItems,
    maxItems = (minItems + this.defaultArrayLengthRange),
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
    const coercedItemSchema = this.coerceSchema(itemSchema);
    return coercedItemSchema;
  });

  return coercedItemsSchemas;
};

const createPseudoObjectSchema = function (singleTypedSchema) {
  const propertiesSchemas = { ...singleTypedSchema.properties };
  const requiredPropertyNames = singleTypedSchema.required || [];

  // It's ok if minProperties is less than required.length. It makes error handling easier
  const { minProperties = 0 } = singleTypedSchema;

  const allDefinedPropertyNames = _.keys(propertiesSchemas);
  const optionalPropertyNames = _.difference(allDefinedPropertyNames, requiredPropertyNames);

  const totalProperties = optionalPropertyNames.length + requiredPropertyNames.length;

  const {
    maxProperties = _.max([totalProperties, minProperties]) + this.defaultPotentialExtraProperties,
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

const conformSchemaToType = function (singleTypedSchema) {
  const { type } = singleTypedSchema;
  const conformedSchema = { type };

  switch (type) {
    case 'string': {
      const minLength = singleTypedSchema.minLength || this.defaultMinStringLength;
      const maxLength = singleTypedSchema.maxLength || (minLength + this.defaultStringLengthRange);

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
        minimum = this.defaultMinNumber;
        maximum = this.defaultMaxNumber;
      } else if (minimum !== undefined && maximum === undefined) {
        maximum = (minimum + this.numberRange);
      } else if (minimum === undefined && maximum !== undefined) {
        minimum = maximum - this.numberRange;
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
      const pseudoArraySchema = this.createPseudoArraySchema(singleTypedSchema);
      const coercedItemsSchemas = this.getCoercedItemsSchemas(pseudoArraySchema);

      return {
        ...conformedSchema,
        items: coercedItemsSchemas,
      };
    }
    case 'object': {
      const pseudoObjectSchema = this.createPseudoObjectSchema(singleTypedSchema);
      this.guaranteeRequiredPropertiesHaveSchemas(pseudoObjectSchema);
      this.fillOutPropertiesToGenerate(pseudoObjectSchema);
      const coercedPropertiesSchemas = this.getCoercedPropertiesSchemas(pseudoObjectSchema);

      return {
        ...conformedSchema,
        properties: coercedPropertiesSchemas,
      };
    }
    default: return conformedSchema;
  }
};

module.exports = {
  generateDefaultNestedSchema,
  createPseudoArraySchema,
  getCoercedItemsSchemas,
  createPseudoObjectSchema,
  guaranteeRequiredPropertiesHaveSchemas,
  generateAdditionalPropertyName,
  fillOutPropertiesToGenerate,
  getCoercedPropertiesSchemas,
  conformSchemaToType,
};
