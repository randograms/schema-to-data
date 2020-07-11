const decimalSchema = {
  type: 'number',
  not: { type: 'integer' },
};

const mapBasicSchemas = (callback) => {
  const descriptorSchemaTuples = [
    ['null', { type: 'null' }],
    ['a string', { type: 'string' }],
    ['a decimal', decimalSchema],
    ['an integer', { type: 'integer' }],
    ['a boolean', { type: 'null' }],
    ['an array', { type: 'array' }],
    ['an object', { type: 'object' }],
  ];

  return descriptorSchemaTuples.map(([schemaDescriptor, basicSchema]) => callback({ schemaDescriptor, basicSchema }));
};

module.exports = {
  decimalSchema,
  mapBasicSchemas,
};
