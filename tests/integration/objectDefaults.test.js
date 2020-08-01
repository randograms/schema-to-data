const customDefaults = {
  maxExtraAdditionalProperties: 2,
};

describe('object defaults', function () {
  testSchema({
    scenario: 'with an object schema',
    customDefaults,
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an object with less than or equal to "maxExtraAdditionalProperties" properties',
        maxProperties: 2,
      },
      {
        itSometimesReturns: 'an object with 0 properties',
        maxProperties: 0,
      },
      {
        itSometimesReturns: 'an object with a number of properties between 0 and "maxExtraAdditionalProperties"',
        minProperties: 1,
        maxProperties: 1,
      },
      {
        itSometimesReturns: 'an object with "maxExtraAdditionalProperties" properties',
        minProperties: 2,
      },
    ],
  });

  testSchema({
    scenario: 'with an array schema with an object item',
    customDefaults,
    schema: {
      itAlwaysReturns: 'an array with one object item',
      type: 'array',
      items: { type: 'object' },
      minItems: 1,
      maxItems: 1,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an array with an object with less than or equal to "maxExtraAdditionalProperties" properties',
        items: {
          maxProperties: 2,
        },
      },
      {
        itSometimesReturns: 'an array with an object with 0 properties',
        items: {
          maxProperties: 0,
        },
      },
      {
        itSometimesReturns: 'an array with an object with number of properties between 0 and "maxExtraAdditionalProperties"', // eslint-disable-line max-len
        items: {
          minProperties: 1,
          maxProperties: 1,
        },
      },
      {
        itSometimesReturns: 'an array with an object with "maxExtraAdditionalProperties" properties',
        items: {
          minProperties: 2,
        },
      },
    ],
  });

  testSchema({
    scenario: 'with an object schema with an object property',
    customDefaults,
    schema: {
      itAlwaysReturns: 'an object with one object property',
      type: 'object',
      properties: {
        property1: {
          type: 'object',
        },
      },
      required: ['property1'],
      maxProperties: 1,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an object with an object property with less than or equal to "maxExtraAdditionalProperties" properties', // eslint-disable-line max-len
        additionalProperties: {
          maxProperties: 2,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with 0 properties',
        additionalProperties: {
          maxProperties: 0,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with number of properties between 0 and "maxExtraAdditionalProperties"', // eslint-disable-line max-len
        additionalProperties: {
          minProperties: 1,
          maxProperties: 1,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with "maxExtraAdditionalProperties" properties',
        additionalProperties: {
          minProperties: 2,
        },
      },
    ],
  });
});
