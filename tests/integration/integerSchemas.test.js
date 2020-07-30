describe('integer schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an integer',
      type: 'integer',
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'a negative integer',
        exclusiveMaximum: 0,
      },
      {
        itSometimesReturns: 'a positive integer',
        exclusiveMinimum: 0,
      },
    ],
  });

  testSchema({
    scenario: 'with minimum and maximum',
    schema: {
      itAlwaysReturns: 'an integer in the range',
      type: 'integer',
      minimum: 2,
      maximum: 6,
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'the minimum',
        const: 2,
      },
      {
        itSometimesReturns: 'the maximum',
        const: 6,
      },
      {
        itSometimesReturns: 'an integer that is not the minimum or maximum',
        enum: [3, 4, 5],
      },
    ],
  });

  testSchema({
    scenario: 'when minimum is a decimal',
    schema: {
      itAlwaysReturns: 'an integer',
      type: 'integer',
      minimum: 1.1,
    },
  });

  testSchema({
    scenario: 'when maximum is a decimal',
    schema: {
      itAlwaysReturns: 'an integer',
      type: 'integer',
      maximum: 1.1,
    },
  });
});
