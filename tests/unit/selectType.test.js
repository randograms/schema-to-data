const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('selectType', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  context('with a typedSchema with a single type', function () {
    before(function () {
      this.typedSchema = {
        type: ['integer'],
        additionalSchemaKeys,
      };

      this.result = testUnit(defaultMocker, 'selectType', this.typedSchema);
    });

    it('returns a schema with a single string type', function () {
      expect(this.result.type).to.equal('integer');
    });

    it('returns a schema with any additional keys', function () {
      expect(this.result.additionalSchemaKeys).to.equal(additionalSchemaKeys);
    });
  });

  context('with a typedSchema with multiple types', function () {
    this.retries(20);

    beforeEach(function () {
      this.typedSchema = {
        type: [
          'null',
          'string',
          'decimal',
          'integer',
          'boolean',
          'array',
          'object',
        ],
        additionalSchemaKeys,
      };

      this.results = _.times(10, () => testUnit(defaultMocker, 'selectType', this.typedSchema));
    });

    it('always returns a schema with a single type', function () {
      expect(this.results).to.all.satisfy((singleTypedSchema) => _.isString(singleTypedSchema.type));
    });

    it('always returns a schema with the additional keys', function () {
      expect(this.results).to.all.satisfy((singleTypedSchema) => (
        singleTypedSchema.additionalSchemaKeys === additionalSchemaKeys
      ));
    });

    it('can return a null schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'null',
        additionalSchemaKeys,
      });
    });

    it('can return a string schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
        additionalSchemaKeys,
      });
    });

    it('can return a decimal schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
        additionalSchemaKeys,
      });
    });

    it('can return an integer schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
        additionalSchemaKeys,
      });
    });

    it('can return a boolean schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
        additionalSchemaKeys,
      });
    });

    it('can return an array schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
        additionalSchemaKeys,
      });
    });

    it('can return an object schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        additionalSchemaKeys,
      });
    });
  });
});
