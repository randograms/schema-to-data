const { decimalSchema } = require('./helpers/commonSchemas');

describe('number schemas', function () {
  testSchema({
    scenario: 'with just type',
    schema: { type: 'number' },
    itSometimesValidatesAgainst: [
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
