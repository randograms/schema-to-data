describe('malformed schemas', function () {
  testSchema({
    scenario: 'when type is an empty array',
    schema: { type: [] },
    itThrowsTheError: 'Expected schema to have a known type but got "undefined"',
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
  });

  testSchema({
    scenario: 'when type is not a string or array',
    schema: { type: {} },
    theSchemaIsInvalidBecause: 'data.type should be equal to one of the allowed values',
  });
});
