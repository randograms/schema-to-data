module.exports.generateDefaultNestedSchema = () => ({
  items: { type: ['null', 'string', 'number', 'boolean'] },
  minItems: 0,
  maxItems: 5,
  minProperties: 0,
  maxProperties: 3,
});
