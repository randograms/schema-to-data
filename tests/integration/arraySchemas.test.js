describe('array schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
    },
    runCount: 30,
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
});
