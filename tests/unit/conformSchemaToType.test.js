const { defaultMocker } = require('../../lib/mocker');

describe('conformSchemaToType', function () {
  [
    'array',
    'boolean',
    'decimal',
    'integer',
    'null',
    'object',
    'string',
  ].forEach((type) => {
    context(`with a singleTypedSchema with just a type keyword of "${type}"`, function () {
      before(function () {
        this.singleTypedSchema = {
          type,
          unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
        };

        this.result = testUnit(defaultMocker, 'conformSchemaToType', this.singleTypedSchema);
      });

      it('returns a copy of the schema', function () {
        expect(this.result).to.not.equal(this.singleTypedSchema);
      });

      it('returns a schema with the type (and relevant keys)', function () {
        expect(this.result.type).to.equal(type);

        // Note: testUnit covers the assertion that the schema has relevant keys
      });
    });
  });
});
