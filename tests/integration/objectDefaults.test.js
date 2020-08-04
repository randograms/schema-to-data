describe('object size defaults', function () {
  testSchema({
    scenario: 'with an object schema, "minObjectProperties" and "maxExtraAdditionalProperties"',
    customDefaults: {
      minObjectProperties: 20,
      maxExtraAdditionalProperties: 5,
    },
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
    scenario: 'with an object schema with a defined size and "optionalPropertyPrioritization" set to 0',
    customDefaults: {
      optionalPropertyPrioritization: 0,
    },
    schema: {
      itAlwaysReturns: 'an object with the defined number of properties',
      type: 'object',
      properties: {
        property1: true,
        property2: true,
      },
      minProperties: 3,
      maxProperties: 3,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an object with just additional properties',
        not: {
          anyOf: [
            { required: ['property1'] },
            { required: ['property2'] },
          ],
        },
      },
    ],
  });

  testSchema({
    scenario: 'with an object schema with a defined size and "optionalPropertyPrioritization" set to  1',
    customDefaults: {
      optionalPropertyPrioritization: 1,
    },
    schema: {
      itAlwaysReturns: 'an object with the defined number of properties',
      type: 'object',
      properties: {
        property1: true,
        property2: true,
      },
      minProperties: 3,
      maxProperties: 3,
    },
    itValidatesAgainst: [
      {
        itAlwaysReturns: 'an object with the optional properties',
        required: ['property1', 'property2'],
      },
    ],
  });

  testSchema({
    scenario: 'with an object schema with a defined size and "optionalPropertyPrioritization" between 0 and 1',
    customDefaults: {
      optionalPropertyPrioritization: 0.5,
    },
    schema: {
      itAlwaysReturns: 'an object with the defined number of properties',
      type: 'object',
      properties: {
        property1: true,
        property2: true,
      },
      minProperties: 2,
      maxProperties: 2,
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with just optional properties',
        required: ['property1', 'property2'],
      },
      {
        itSometimesReturns: 'an object with the first optional property and an additional property',
        required: ['property1'],
        not: {
          required: ['property2'],
        },
      },
      {
        itSometimesReturns: 'an object with the second optional property and an additional property',
        required: ['property2'],
        not: {
          required: ['property1'],
        },
      },
      {
        itSometimesReturns: 'an object with just additional properties',
        not: {
          anyOf: [
            { required: ['property1'] },
            { required: ['property2'] },
          ],
        },
      },
    ],
  });
});
