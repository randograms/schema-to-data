const _ = require('lodash');

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
