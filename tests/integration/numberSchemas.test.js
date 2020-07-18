const { decimalSchema } = require('./helpers/commonSchemas');

describe('number schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'a number',
      type: 'number',
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an integer',
        type: 'integer',
      },
      {
        itSometimesReturns: 'a negative integer',
        type: 'integer',
        exclusiveMaximum: 0,
      },
      {
        itSometimesReturns: 'a positive integer',
        type: 'integer',
        exclusiveMinimum: 0,
      },
      {
        itSometimesReturns: 'a decimal',
        ...decimalSchema,
      },
      {
        itSometimesReturns: 'a negative decimal',
        ...decimalSchema,
        exclusiveMaximum: 0,
      },
      {
        itSometimesReturns: 'a positive decimal',
        ...decimalSchema,
        exclusiveMinimum: 0,
      },
    ],
  });

  testSchema({
    scenario: 'with minimum and maximum',
    schema: {
      itAlwaysReturns: 'a number in the range',
      type: 'number',
      minimum: 2.5,
      maximum: 3.5,
    },
    runCount: 30,
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
        itSometimesReturns: 'a number less than the median of the range',
        exclusiveMaximum: 3,
      },
      {
        itSometimesReturns: 'a number greater than the median of the range',
        exclusiveMinimum: 3,
      },
    ],
  });
});
