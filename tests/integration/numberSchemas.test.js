const { decimalSchema } = require('./helpers/commonSchemas');

describe('number schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a number',
      type: 'number',
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an integer',
        type: 'integer',
      },
      {
        itSometimesReturns: 'a decimal',
        ...decimalSchema,
      },
    ],
  });
});
