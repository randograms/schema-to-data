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

  testSchema({
    scenario: 'with minLength',
    schema: {
      itAlwaysReturns: 'a string with a length greater than or equal to minLength',
      type: 'string',
      minLength: 100,
    },
  });

  testSchema({
    scenario: 'with maxLength',
    schema: {
      itAlwaysReturns: 'a string with a length less than or equal to maxLength',
      type: 'string',
      maxLength: 10,
    },
  });

  testSchema({
    scenario: 'with minLength and maxLength',
    schema: {
      itAlwaysReturns: 'a string with a length between minLength and maxLength',
      type: 'string',
      minLength: 30,
      maxLength: 35,
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'a string with the minLength',
        minLength: 30,
        maxLength: 30,
      },
      {
        itSometimesReturns: 'a string with the maxLength',
        minLength: 35,
        maxLength: 35,
      },
      {
        itSometimesReturns: 'a string that is not the minLength or maxLength',
        minLength: 31,
        maxLength: 34,
      },
    ],
  });
});
