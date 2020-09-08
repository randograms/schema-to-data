module.exports.generateArray = function (arraySchema) {
  // "items" will have been coerced to a tuple of coerced schemas
  const { items } = arraySchema;
  return items.map((coercedItemSchema) => this.generateData(coercedItemSchema));
};
