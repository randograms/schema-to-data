const { mapBasicSchemas } = require('./helpers/commonSchemas');

describe('typeless schemas', function () {
  testSchema({
    scenario: 'when type is undefined',
    schema: {},
    runCount: 30,
    itSometimesValidatesAgainst: mapBasicSchemas(({ descriptor, basicSchema }) => ({
      itSometimesReturns: `${descriptor}`,
      ...basicSchema,
    })),
  });
});
