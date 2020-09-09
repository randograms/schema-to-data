describe('enum', function () {
  testSchema({
    scenario: 'with an enum with various types',
    schema: {
      itAlwaysReturns: 'a value from the enum',
      enum: [
        [],
        true,
        1.1,
        1,
        null,
        {},
        'a',
      ],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an array',
        const: [],
      },
      {
        itSometimesReturns: 'a boolean',
        const: true,
      },
      {
        itSometimesReturns: 'a decimal',
        const: 1.1,
      },
      {
        itSometimesReturns: 'an integer',
        const: 1.1,
      },
      {
        itSometimesReturns: 'null',
        const: null,
      },
      {
        itSometimesReturns: 'an object',
        const: {},
      },
      {
        itSometimesReturns: 'an string',
        const: 'a',
      },
    ],
  });
});
