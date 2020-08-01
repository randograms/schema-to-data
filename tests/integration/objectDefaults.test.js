const customDefaults = {
  minObjectProperties: 20,
  maxExtraAdditionalProperties: 5,
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
        itAlwaysReturns: 'an object with number of properties in the range ["minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"]', // eslint-disable-line max-len
        minProperties: 20,
        maxProperties: 25,
      },
      {
        itSometimesReturns: 'an object with "minObjectProperties" properties',
        maxProperties: 20,
      },
      {
        itSometimesReturns: 'an object with number of properties in the range ("minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"])', // eslint-disable-line max-len
        minProperties: 21,
        maxProperties: 24,
      },
      {
        itSometimesReturns: 'an object with "minObjectProperties" + "maxExtraAdditionalProperties" properties',
        minProperties: 25,
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
        itAlwaysReturns: 'an array with an object with number of properties in the range ["minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"]', // eslint-disable-line max-len
        items: {
          minProperties: 20,
          maxProperties: 25,
        },
      },
      {
        itSometimesReturns: 'an array with an object with "minObjectProperties" properties',
        items: {
          maxProperties: 20,
        },
      },
      {
        itSometimesReturns: 'an array with an object with number of properties in the range ("minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"])', // eslint-disable-line max-len
        items: {
          minProperties: 21,
          maxProperties: 24,
        },
      },
      {
        itSometimesReturns: 'an array with an object with "minObjectProperties" + "maxExtraAdditionalProperties" properties', // eslint-disable-line max-len
        items: {
          minProperties: 25,
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
        itAlwaysReturns: 'an object with an object property with number of properties in the range ["minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"]', // eslint-disable-line max-len
        additionalProperties: {
          minProperties: 20,
          maxProperties: 25,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with "minObjectProperties" properties',
        additionalProperties: {
          maxProperties: 20,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with number of properties in the range ("minObjectProperties", "minObjectProperties" + "maxExtraAdditionalProperties"])', // eslint-disable-line max-len
        additionalProperties: {
          minProperties: 21,
          maxProperties: 24,
        },
      },
      {
        itSometimesReturns: 'an object with an object property with "minObjectProperties" + "maxExtraAdditionalProperties" properties', // eslint-disable-line max-len
        additionalProperties: {
          minProperties: 25,
        },
      },
    ],
  });
});
