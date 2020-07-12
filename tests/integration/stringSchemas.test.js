describe('string schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a string',
      type: 'string',
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty string',
        maxLength: 0,
      },
      {
        itSometimesReturns: 'a short string',
        minLength: 1,
        maxLength: 10,
      },
      {
        itSometimesReturns: 'a long string',
        minLength: 11,
        maxLength: 20,
      },
    ],
  });
  });
});
