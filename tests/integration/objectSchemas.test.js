describe('object schemas', function () {
  testSchema({
    description: 'with just type',
    schema: { type: 'object' },
  });

  testSchema({
    description: 'with optional properties',
    schema: {
      type: 'object',
      properties: {
        optional1: { type: 'string' },
        optional2: { type: 'number' },
      },
    },
  });

  testSchema({
    description: 'with optional and required properties',
    schema: {
      type: 'object',
      properties: {
        required1: { type: 'string' },
        optional1: { type: 'number' },
      },
      required: ['required1'],
    },
  });

  testSchema({
    description: 'with multi-typed properties',
    schema: {
      type: 'object',
      properties: {
        required1: { type: ['number', 'boolean'] },
      },
      required: ['required1'],
    },
  });

  testSchema({
    description: 'with typless properties',
    schema: {
      type: 'object',
      properties: {
        required1: {},
      },
      required: ['required1'],
    },
  });
});
