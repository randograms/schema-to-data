describe('malformed schemas', function () {
  testSchema({
    description: 'when type is an empty array',
    schema: { type: [] },
    expectedError: 'Expected schema to have a known type but got "undefined"',
  });

  testSchema({
    description: 'when type is not a string or array',
    schema: { type: {} },
    expectedSchemaValidationError: 'data.type should be equal to one of the allowed values',
  });
});
