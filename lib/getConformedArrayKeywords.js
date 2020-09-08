const _ = require('lodash');

const createPseudoArraySchema = function (singleTypedSchema) {
  const { DEFAULTS } = this;

  const itemsDefinition = singleTypedSchema.items !== undefined
    ? singleTypedSchema.items
    : this.generateDefaultNestedSchema();

  const isItemsTheFalseSchema = itemsDefinition === false;
  const isTupleArraySchema = _.isArray(itemsDefinition);

  const itemSchemas = isItemsTheFalseSchema ? [] : _.castArray(itemsDefinition);

  const { additionalItems } = singleTypedSchema;
  const isAdditionalItemsTheFalseSchema = additionalItems === false;
  const isAdditionalItemsSet = additionalItems === true || (!_.isNull(additionalItems) && _.isObject(additionalItems));

  let additionalItemsSchema;
  if (isTupleArraySchema) {
    if (isAdditionalItemsTheFalseSchema) {
      additionalItemsSchema = null;
    } else if (isAdditionalItemsSet) {
      additionalItemsSchema = additionalItems;
    } else {
      additionalItemsSchema = this.generateDefaultNestedSchema();
    }
  } else {
    additionalItemsSchema = itemsDefinition;
  }

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
      : minItems + DEFAULTS.arrayItemsRange,
  } = singleTypedSchema;

  if (isTupleArraySchema && isAdditionalItemsTheFalseSchema) {
    maxItems = itemsDefinition.length;
  }

  if (isUsingDefaultMinItems && maxItems < minItems) {
    minItems = maxItems;
  }

  if (isTupleArraySchema && isAdditionalItemsTheFalseSchema && minItems > itemsDefinition.length) {
    throw Error('Cannot generate data for conflicting "minItems" and "false" literal "additionalItems"');
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
