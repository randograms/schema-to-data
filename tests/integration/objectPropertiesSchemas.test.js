const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('object properties schemas', function () {
  testSchema({
    scenario: 'with multi-typed properties',
    schema: {
      type: 'object',
      properties: {
        required: { type: ['number', 'boolean'] },
      },
      required: ['required'],
    },
    itSometimesValidatesAgainst: [
      {
        itSometimesReturns: 'an object with a property that has the first type',
        properties: { required: { type: 'number' } },
        required: ['required'],
      },
      {
        itSometimesReturns: 'an object with a property that has the second type',
        properties: { required: { type: 'boolean' } },
        required: ['required'],
      },
    ],
  });

  testSchema({
    scenario: 'with typless properties',
    schema: {
      type: 'object',
      properties: {
        required: {},
      },
      required: ['required'],
    },
    runCount: 30,
    itSometimesValidatesAgainst: mapBasicSchemas(({ descriptor, basicSchema }) => ({
      itSometimesReturns: `an object with ${descriptor} property`,
      properties: { required: basicSchema },
      required: ['required'],
    })),
  });
});
