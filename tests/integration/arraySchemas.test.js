describe('array schemas', function () {
  testSchema({
    scenario: 'with just type',
    schema: { type: 'array' },
  });

  testSchema({
    scenario: 'when items is a tuple',
    schema: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
  });

  testSchema({
    scenario: 'with typeless items',
    schema: {
      type: 'array',
      items: {},
    },
  });

  testSchema({
    scenario: 'with single typed items',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  });

  testSchema({
    scenario: 'with multi-typed items',
    schema: {
      type: 'array',
      items: { type: ['string', 'boolean'] },
    },
  });
});
