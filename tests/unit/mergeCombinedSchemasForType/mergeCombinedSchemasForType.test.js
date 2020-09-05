const { defaultMocker } = require('../../../lib/mocker');

/**
 * Note: object schema keywords are used in this test because the library supports several of these keywords.
 * The merge rules for all of the keywords are thoroughly tested in another file
 */
describe('mergeCombinedSchemasForType/mergeCombinedSchemasForType', function () {
  context('when the schema has an allOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        minProperties: 1,
        maxProperties: 10,
        required: ['a'],
        allOf: [
          {
            minProperties: 2,
            required: ['b'],
          },
          {
            maxProperties: 9,
            required: ['c'],
          },
        ],
      };
      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema);
    });

    it('does not modify the original schema', function () {
      expect(this.result).to.not.equal(this.singleTypedSchema);
    });

    it('merges the combined schemas into the root schema', function () {
      expect(this.result).to.eql({
        type: 'object',
        minProperties: 2,
        maxProperties: 9,
        required: ['a', 'b', 'c'],
      });
    });
  });

  context('when the schema has an allOf with an allOf', function () {
    before(function () {
      this.singleTypedSchema = {
        type: 'object',
        minProperties: 1,
        maxProperties: 10,
        required: ['a'],
        allOf: [
          {
            minProperties: 2,
            required: ['b'],
          },
          {
            maxProperties: 9,
            required: ['c'],
            allOf: [
              {
                minProperties: 3,
                required: ['d'],
              },
              {
                maxProperties: 8,
                required: ['e'],
              },
            ],
          },
        ],
      };
      this.result = testUnit(defaultMocker, 'mergeCombinedSchemasForType', this.singleTypedSchema);
    });

    it('does not modify the original schema', function () {
      expect(this.result).to.not.equal(this.singleTypedSchema);
    });

    it('merges the combined schemas into the root schema', function () {
      expect(this.result).to.eql({
        type: 'object',
        minProperties: 3,
        maxProperties: 8,
        required: ['a', 'b', 'c', 'd', 'e'],
      });
    });
  });
});
