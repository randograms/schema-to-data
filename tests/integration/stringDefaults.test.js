const customDefaults = {
  minStringLength: 50,
  stringLengthRange: 5,
};

describe('string defaults', function () {
  testSchema({
    scenario: 'with a string schema',
    customDefaults,
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

  testSchema({
    scenario: 'with an array schema with a string item',
    customDefaults,
    schema: {
      itAlwaysReturns: 'an array with one string item',
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
      maxItems: 1,
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an array with a string item with "minStringLength" length',
        items: [{
          minLength: 50,
          maxLength: 50,
        }],
      },
      {
        itSometimesReturns: 'an array with a string item with length within the allowed range',
        items: [{
          minLength: 51,
          maxLength: 54,
        }],
      },
      {
        itSometimesReturns: 'an array with a string item with length equal to "minStringLength" plus "stringLengthRange"', // eslint-disable-line max-len
        items: [{
          minLength: 55,
          maxLength: 55,
        }],
      },
    ],
  });

  // TODO: update this to use "additionalProperties"
  testSchema({
    scenario: 'with an object with a string property',
    customDefaults,
    schema: {
      itAlwaysReturns: 'an object with one string property',
      type: 'object',
      properties: {
        property1: { type: 'string' },
      },
      minProperties: 1,
      maxProperties: 1,
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with a string property with "minStringLength" length',
        properties: {
          property1: {
            minLength: 50,
            maxLength: 50,
          },
        },
      },
      {
        itSometimesReturns: 'an object with a string property with length within the allowed range',
        properties: {
          property1: {
            minLength: 51,
            maxLength: 54,
          },
        },
      },
      {
        itSometimesReturns: 'an object with a string property with length equal to "minStringLength" plus "stringLengthRange"', // eslint-disable-line max-len
        properties: {
          property1: {
            minLength: 55,
            maxLength: 55,
          },
        },
      },
    ],
  });
});
