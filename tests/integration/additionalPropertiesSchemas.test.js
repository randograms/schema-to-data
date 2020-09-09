const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('additionalProperties schemas', function () {
  testSchema({
    scenario: 'with typeless additionalProperties (object literal schema)',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: {},
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} property`,
      additionalProperties: basicSchema,
    })),
  });

  testSchema({
    scenario: 'with typeless additionalProperties (boolean literal schema)',
    schema: {
      itAlwaysReturns: 'an object',
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: true,
    },
    runCount: 30,
    itValidatesAgainst: mapBasicSchemas(({ schemaDescriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${schemaDescriptor} property`,
      additionalProperties: basicSchema,
    })),
  });

  testSchema({
    scenario: 'with single typed additionalProperties',
    schema: {
      itAlwaysReturns: 'an object with a property of the provided type',
      type: 'object',
      additionalProperties: { type: 'integer' },
    },
  });

  testSchema({
    scenario: 'with multi-typed additionalProperties',
    schema: {
      itAlwaysReturns: 'an object a property restricted by the provided types',
      type: 'object',
      minProperties: 1,
      maxProperties: 1,
      additionalProperties: { type: ['integer', 'boolean'] },
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with a property of the first type',
        additionalProperties: { type: 'integer' },
      },
      {
        itSometimesReturns: 'an object with a property of the second type',
        additionalProperties: { type: 'boolean' },
      },
    ],
  });

  testSchema({
    scenario: 'with a "false" literal additionalProperties schema, required and optional properties and a forced size',
    schema: {
      itAlwaysReturns: 'an object with the specified size and required properties',
      type: 'object',
      properties: {
        property1: true,
        property2: true,
      },
      required: ['property1'],
      minProperties: 2,
      additionalItems: false,
    },
    itValidatesAgainst: [
      {
        itSometimesReturns: 'an object with the optional property',
        required: ['property2'],
      },
    ],
  });

  testSchema({
    scenario: 'with a "false" literal additionalProperties schema and no required or optional properties',
    schema: {
      itAlwaysReturns: 'an empty object',
      type: 'object',
      additionalProperties: false,
    },
  });
});
