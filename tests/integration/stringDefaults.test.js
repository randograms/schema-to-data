describe('string defaults', function () {
  testSchema({
    scenario: 'with a string schema, "minStringLength" and "stringLengthRange"',
    customDefaults: {
      minStringLength: 50,
      stringLengthRange: 5,
    },
    schema: {
      itAlwaysReturns: 'a string',
      type: 'string',
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'a string with "minStringLength" length',
        minLength: 50,
        maxLength: 50,
      },
      {
        itSometimesReturns: 'a string with length within the allowed range',
        minLength: 51,
        maxLength: 54,
      },
      {
        itSometimesReturns: 'a string with length equal to "minStringLength" plus "stringLengthRange"',
        minLength: 55,
        maxLength: 55,
      },
    ],
  });
});
