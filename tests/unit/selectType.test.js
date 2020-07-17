const _ = require('lodash');
const { lib } = require('../..');

const generateValidTestSchema = ({ type = [], ...additionalSchemaKeys } = {}) => ({ type, ...additionalSchemaKeys });

describe('selectType', function () {
  context('with a typedSchema with a single type', function () {
    before(function () {
      const typedSchema = generateValidTestSchema({
        type: ['integer'],
      });

      this.result = lib.selectType(typedSchema);
    });

    it('returns a schema with a single string type', function () {
      expect(this.result.type).to.be.a('string').and.to.equal('integer');
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
      };
      const typedSchema = generateValidTestSchema(this.typedSchema);

      this.results = _.times(10, () => lib.selectType(typedSchema));
    });

    it('always returns a schema with a single type', function () {
      expect(this.results).to.all.satisfy((data) => _.isString(data.type));
    });

    it('always returns a copy of the schema', function () {
      expect(this.results).to.not.include.something.that.equals(this.typedSchema);
    });

    it('can return a null schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'null',
      });
    });

    it('can return a string schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'string',
      });
    });

    it('can return a decimal schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'decimal',
      });
    });

    it('can return an integer schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'integer',
      });
    });

    it('can return a boolean schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'boolean',
      });
    });

    it('can return an array schema with a default items tuple and additionalItems definition', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'array',
      });
    });

    it('can return an object schema', function () {
      expect(this.results).to.include.something.that.eqls({
        type: 'object',
      });
    });
  });
});
