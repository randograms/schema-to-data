const _ = require('lodash');
const { lib } = require('../..');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ type = [], ...additionalSchemaKeys } = {}) => ({ type, ...additionalSchemaKeys });

describe('selectType', function () {
  before(function () {
    this.defaultNestedSchema = Symbol('defaultNestedSchema');
    sandbox.stub(lib, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
  });
  after(sandbox.restore);

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

    it('can return an array schema', function () {
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

  context('with a typedSchema with a malformed type', function () {
    it('returns a copy of the schema with a single type', function () {
      const additionalSchemaKeys = Symbol('additionalSchemaKeys');
      const typedSchema = generateValidTestSchema({
        type: ['whoops'],
        additionalSchemaKeys,
      });

      const result = lib.selectType(typedSchema);
      expect(result).to.not.equal(typedSchema);
      expect(result).to.eql({
        type: 'whoops',
        additionalSchemaKeys,
      });
    });
  });
});
