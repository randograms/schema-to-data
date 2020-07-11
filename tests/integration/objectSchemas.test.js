describe('object schemas', function () {
  // TODO: test that this always returns an empty object (for now)
  testSchema({
    scenario: 'with just type',
    schema: { type: 'object' },
  });

  testSchema({
    scenario: 'with optional properties',
    schema: {
      type: 'object',
      properties: {
        optional1: { type: 'string' },
        optional2: { type: 'number' },
      },
    },
    runCount: 40,
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
    scenario: 'with optional and required properties',
    schema: {
      type: 'object',
      properties: {
        required: { type: 'string' },
        optional: { type: 'number' },
      },
      required: ['required'],
    },
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an object with just the required property',
        properties: { required: { type: 'string' } },
        required: ['required'],
        additionalProperties: false,
      },
      {
        itSometimesReturns: 'an object with both properties',
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
