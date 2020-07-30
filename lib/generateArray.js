module.exports.generateArray = function (arraySchema) {
  // all array schemas will have been coerced to a tuple array schema
  const { items } = arraySchema;
  return items.map((coercedItemSchema) => this.generateData(coercedItemSchema));
};
