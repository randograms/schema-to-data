describe('array schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
    },
    runCount: 100,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty array',
        maxItems: 0,
      },
      {
        itSometimesReturns: 'an array with some items',
        minItems: 1,
        maxItems: 10,
      },
      {
        itSometimesReturns: 'an array with many items',
        minItems: 11,
      },
    ],
  });

  testSchema({
    scenario: 'with "minItems" and "maxItems"',
    schema: {
      itAlwaysReturns: 'an array',
      type: 'array',
      minItems: 32,
      maxItems: 36,
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an array with length of "minItems"',
        minItems: 32,
        maxItems: 32,
      },
      {
        itSometimesReturns: 'an array with length of "maxItems"',
        minItems: 33,
        maxItems: 35,
      },
      {
        itSometimesReturns: 'an array with length between "minItems" and "maxItems"',
        minItems: 36,
        maxItems: 36,
      },
    ],
  });
});
