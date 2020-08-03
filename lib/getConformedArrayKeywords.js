const _ = require('lodash');

const createPseudoArraySchema = function (singleTypedSchema) {
  const { DEFAULTS } = this;

  const itemsDefinition = singleTypedSchema.items !== undefined
    ? singleTypedSchema.items
    : this.generateDefaultNestedSchema();

  const isItemsTheFalseSchema = itemsDefinition === false;
  const isTupleArraySchema = _.isArray(itemsDefinition);

  const itemSchemas = isItemsTheFalseSchema ? [] : _.castArray(itemsDefinition);
  const additionalItemsSchema = isTupleArraySchema ? this.generateDefaultNestedSchema() : itemsDefinition;

  let { minItems } = singleTypedSchema;
  if (isItemsTheFalseSchema && minItems > 0) {
    throw Error('Cannot generate array items for "false" literal items schema and non-zero "minItems"');
  }

  const isUsingDefaultMinItems = !_.isInteger(minItems);
  if (isUsingDefaultMinItems) {
    minItems = DEFAULTS.minArrayItems;
  }

  let {
    maxItems = isTupleArraySchema
      ? Math.max(itemSchemas.length, minItems) + DEFAULTS.maxExtraAdditionalItems
      : minItems + DEFAULTS.arrayLengthRange,
  } = singleTypedSchema;

  if (isUsingDefaultMinItems && maxItems < minItems) {
    minItems = maxItems;
  }

  if (maxItems < minItems) {
    throw Error('Cannot generate data for conflicting "minItems" and "maxItems"');
  }

  if (isItemsTheFalseSchema) {
    minItems = 0;
    maxItems = 0;
  }

  return {
    items: itemSchemas,
    additionalItems: additionalItemsSchema,
    minItems,
    maxItems,
  };
};

const getCoercedItemsSchemas = function (pseudoArraySchema) {
  const {
    items,
    additionalItems,
    minItems,
    maxItems,
  } = pseudoArraySchema;

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

const getConformedArrayKeywords = function (singleTypedSchema) {
  const pseudoArraySchema = this.createPseudoArraySchema(singleTypedSchema);
  const coercedItemsSchemas = this.getCoercedItemsSchemas(pseudoArraySchema);

  return {
    items: coercedItemsSchemas,
  };
};

module.exports = {
  createPseudoArraySchema,
  getCoercedItemsSchemas,
  getConformedArrayKeywords,
};
