describe('tuple array items schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: [{}, {}, {}],
    },
    runCount: 100,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty array',
        maxItems: 0,
      },
      {
        itSometimesReturns: 'an array with one item',
        minItems: 1,
        maxItems: 1,
      },
      {
        itSometimesReturns: 'an array with multiple items',
        minItems: 3,
      },
    ],
  });

  testSchema({
    scenario: 'with typed items',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
    },
    runCount: 100,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty array',
        minItems: 0,
        maxItems: 0,
      },
      {
        itSometimesReturns: 'an array with just the first item',
        items: [{ type: 'string' }],
        minItems: 1,
        maxItems: 1,
      },
      {
        itSometimesReturns: 'an array with some items',
        items: [{ type: 'string' }, { type: 'number' }],
        minItems: 2,
        maxItems: 2,
      },
      {
        itSometimesReturns: 'an array with all items',
        items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }],
        minItems: 3,
        maxItems: 3,
      },
      {
        itSometimesReturns: 'an array with additional items',
        minItems: 4,
      },
    ],
  });
});
