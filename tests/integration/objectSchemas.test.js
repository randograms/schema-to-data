describe('object schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
    },
    runCount: 30,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty object',
        const: {},
      },
      {
        itSometimesReturns: 'an object with at least one property',
        minProperties: 1,
      },
    ],
  });

  testSchema({
    scenario: 'with optional properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      properties: {
        property1: {},
        property2: {},
      },
    },
    runCount: 100,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an empty object',
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just the first property',
        properties: { property1: {} },
        required: ['property1'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just the second property',
        properties: { property2: {} },
        required: ['property2'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just both properties',
        properties: { property1: {}, property2: {} },
        required: ['property1', 'property2'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with additional properties',
        required: ['property1', 'property2'],
        minProperties: 4,
      },
    ],
  });

  testSchema({
    scenario: 'with required properties',
    schema: {
      itAlwaysReturns: 'an object with the required properties',
      type: 'object',
      required: ['property1', 'property2'],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with just the required properties',
        properties: { property1: {}, property2: {} },
        required: ['property1', 'property2'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with additional properties',
        required: ['property1', 'property2'],
        minProperties: 4,
      },
    ],
  });

  testSchema({
    scenario: 'with optional and required properties',
    schema: {
      itAlwaysReturns: 'an object with the required properties',
      type: 'object',
      properties: {
        property1: {},
        property2: {},
      },
      required: ['property1'],
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with just the required properties',
        properties: { property1: {} },
        required: ['property1'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just the defined properties',
        properties: { property1: {}, property2: {} },
        required: ['property1', 'property2'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with additional properties',
        minProperties: 3,
      },
    ],
  });

  testSchema({
    scenario: 'with "minProperties" and "maxProperties"',
    schema: {
      itAlwaysReturns: 'an object with size beween "minProperties" and "maxProperties"',
      type: 'object',
      minProperties: 2,
      maxProperties: 6,
    },
    runCount: 50,
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with "minProperties" properties',
        minProperties: 2,
        maxProperties: 2,
      },
      {
        itSometimesReturns: 'an object with size that is not "minProperties" or "maxProperties"',
        minProperties: 3,
        maxProperties: 5,
      },
      {
        itSometimesReturns: 'an object with "maxProperties" properties',
        minProperties: 6,
        maxProperties: 6,
      },
    ],
  });

  testSchema({
    scenario: 'with "propertyNames"',
    schema: {
      itAlwaysReturns: 'an object with properties with names that matches the propertyNames schema',
      type: 'object',
      propertyNames: {
        enum: ['abc', 'def'],
      },
      minProperties: 2,
      maxProperties: 2,
    },
  });

  testSchema({
    scenario: 'with "patternProperties"',
    schema: {
      itAlwaysReturns: 'an object with properties with valid types',
      type: 'object',
      patternProperties: {
        ab: { type: 'string' },
        cd: { type: 'integer' },
      },
      propertyNames: {
        enum: ['ab', 'cd'],
      },
      minProperties: 2,
      maxProperties: 2,
    },
  });
});
