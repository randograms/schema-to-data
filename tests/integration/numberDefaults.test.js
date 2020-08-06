const { decimalSchema } = require('./helpers/commonSchemas');

describe('number schemas', function () {
  testSchema({
    scenario: 'with "minNumber" and "maxNumber"',
    customDefaults: {
      minNumber: 3,
      maxNumber: 7,
    },
    schema: {
      itAlwaysReturns: 'a number',
      type: 'number',
    },
    runCount: 50,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an integer',
        type: 'integer',
      },
      {
        itSometimesReturns: 'a decimal',
        ...decimalSchema,
      },
      {
        itSometimesReturns: 'the default "minNumber"',
        maximum: 3,
      },
      {
        itSometimesReturns: 'the default "maxNumber"',
        minimum: 7,
      },
      {
        itSometimesReturns: 'a number between the default "minNumber" and "maxNumber"',
        exclusiveMinimum: 3,
        exclusiveMaximum: 7,
      },
    ],
  });
});
