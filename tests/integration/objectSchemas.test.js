describe('object schemas', function () {
  testSchema({
    scenario: 'with just type',
    schema: { type: 'object' },
  });

  testSchema({
    scenario: 'with optional properties',
    schema: {
      type: 'object',
      properties: {
        optional1: { type: 'string' },
        optional2: { type: 'number' },
      },
    },
  });

  testSchema({
    scenario: 'with optional and required properties',
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
    scenario: 'with multi-typed properties',
    schema: {
      type: 'object',
      properties: {
        required1: { type: ['number', 'boolean'] },
      },
      required: ['required1'],
    },
  });

  testSchema({
    scenario: 'with typless properties',
    schema: {
      type: 'object',
      properties: {
        required1: {},
      },
      required: ['required1'],
    },
  });
});
