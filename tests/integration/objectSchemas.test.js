describe('object schemas', function () {
  testSchema({
    scenario: 'by default',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
    },
    itAlwaysValidatesAgainst: [
      {
        itAlwaysReturns: 'an empty object (for now)',
        const: {},
      },
    ],
  });

  testSchema({
    scenario: 'with optional properties',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      properties: {
        optional1: { type: 'string' },
        optional2: { type: 'number' },
      },
    },
    runCount: 100,
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an empty object',
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just the first property',
        properties: { optional1: { type: 'string' } },
        required: ['optional1'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with just the second property',
        properties: { optional2: { type: 'number' } },
        required: ['optional2'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with both properties',
        properties: {
          optional1: { type: 'string' },
          optional2: { type: 'number' },
        },
        required: ['optional1', 'optional2'],
        additionalProperties: false,
      },
    ],
  });

  testSchema({
    scenario: 'with required properties',
    schema: {
      itAlwaysReturns: 'an object with the required proeprties',
      type: 'object',
      required: ['property1', 'property2'],
    },
  });

  testSchema({
    scenario: 'with optional and required properties',
    schema: {
      itAlwaysReturns: 'an object with the required properties',
      type: 'object',
      properties: {
        required: { type: 'string' },
        optional: { type: 'number' },
      },
      required: ['required'],
    },
    runCount: 20,
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an object with just the required properties',
        properties: { required: { type: 'string' } },
        required: ['required'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with all properties',
        properties: {
          required: { type: 'string' },
          optional: { type: 'number' },
        },
        required: ['required', 'optional'],
        additionalProperties: false,
      },
    ],
  });
});
