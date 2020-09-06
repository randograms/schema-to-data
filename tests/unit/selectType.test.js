const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('selectType', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  context('with a typedSchema with a single type', function () {
    before(function () {
      this.typedSchema = {
        type: ['integer'],
        allOf: null,
        anyOf: null,
        oneOf: null,
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

    const allExpectedAdditionalKeys = {
      allOf: null,
      anyOf: null,
      oneOf: null,
      additionalSchemaKeys,
    };

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
        allOf: null,
        anyOf: null,
        oneOf: null,
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
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a string schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a decimal schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an integer schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return a boolean schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an array schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
        ...allExpectedAdditionalKeys,
      });
    });

    it('can return an object schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
        ...allExpectedAdditionalKeys,
      });
    });
  });
});
