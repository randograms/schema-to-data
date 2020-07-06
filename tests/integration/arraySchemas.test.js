describe('array schemas', function () {
  testSchema({
    description: 'with just type',
    schema: { type: 'array' },
  });

  testSchema({
    description: 'when items is a tuple',
    schema: {
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
  });

  testSchema({
    description: 'with typeless items',
    schema: {
      type: 'array',
      items: {},
    },
  });

  testSchema({
    description: 'with single typed items',
    schema: {
      type: 'array',
      items: { type: 'string' },
    },
  });

  testSchema({
    description: 'with multi-typed items',
    schema: {
      type: 'array',
      items: { type: ['string', 'boolean'] },
    },
  });
});
