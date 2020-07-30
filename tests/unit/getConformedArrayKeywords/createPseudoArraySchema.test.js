const { defaultMocker } = require('../../../lib/mocker');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ ...additionalSchemaKeys } = {}) => ({
  ...additionalSchemaKeys,
  type: 'array',
});

describe('getConformedArrayKeywords/createPseudoArraySchema', function () {
  before(function () {
    this.defaultNestedSchema = Symbol('defaultNestedSchema');
    sandbox.stub(defaultMocker, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
  });
  after(sandbox.restore);

  context('with an array schema with a list items definition', function () {
    before(function () {
      this.itemSchema = Symbol('itemSchema');

      const singleTypedSchema = generateValidTestSchema({
        items: this.itemSchema,
      });

      this.result = defaultMocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with the item schema as the items tuple and the additionalItems', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema],
        additionalItems: this.itemSchema,
        minItems: undefined,
        maxItems: undefined,
      });
    });
  });

  context('with an array schema with a tuple items definition', function () {
    before(function () {
      this.itemSchema1 = Symbol('itemSchema1');
      this.itemSchema2 = Symbol('itemSchema2');
      this.itemSchema3 = Symbol('itemSchema3');

      const singleTypedSchema = generateValidTestSchema({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
      });

      this.result = defaultMocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with tuple items and a default additionalItems', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        additionalItems: this.defaultNestedSchema,
        minItems: undefined,
        maxItems: undefined,
      });
    });
  });

  context('with an array schema with a "false" literal items schema', function () {
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        items: false,
      });

      this.result = defaultMocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with an empty items tuple and restricted length', function () {
      expect(this.result).to.eql({
        items: [],
        minItems: 0,
        maxItems: 0,
        additionalItems: false,
      });
    });
  });

  context('with an array schema with a "false" literal items schema and non-zero "minItems"', function () {
    it('throws an error', function () {
      const singleTypedSchema = generateValidTestSchema({
        items: false,
        minItems: 1,
      });

      const testFn = () => {
        defaultMocker.createPseudoArraySchema(singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate array items for "false" literal items schema and non-zero "minItems"');
    });
  });
});
