const { defaultMocker } = require('../../lib/mocker');

describe('conformSchemaToType', function () {
  context('with a singleTypedSchema with a malformed type', function () {
    it('returns a schema with just the type', function () {
      const singleTypedSchema = {
        type: 'whoops',
        unsupportedSchemaKey: Symbol('unsupportedSchemaKey'),
      };

      const result = defaultMocker.conformSchemaToType(singleTypedSchema);
      expect(result).to.not.equal(singleTypedSchema);
      expect(result).to.eql({ type: 'whoops' });
    });
  });
});
