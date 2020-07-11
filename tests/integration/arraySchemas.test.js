describe('array schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: { type: 'array' },
    itSometimesValidatesAgainst: [
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
});
