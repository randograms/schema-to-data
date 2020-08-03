const { defaultMocker } = require('../../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('getConformedArrayKeywords/getCoercedItemsSchemas', function () {
  before(function () {
    this.itemSchema1 = Symbol('itemSchema1');
    this.itemSchema2 = Symbol('itemSchema2');
    this.additionalItemsSchema = Symbol('additionalItemsSchema');

    this.coercedItemSchema1 = Symbol('coercedItemSchema1');
    this.coercedItemSchema2 = Symbol('coercedItemSchema2');
    this.coercedAdditionalItemsSchema = Symbol('coercedAdditionalItemsSchema');

    const stub = sandbox.stub(defaultMocker, 'coerceSchema');
    stub.withArgs(this.itemSchema1).returns(this.coercedItemSchema1);
    stub.withArgs(this.itemSchema2).returns(this.coercedItemSchema2);
    stub.withArgs(this.additionalItemsSchema).returns(this.coercedAdditionalItemsSchema);
  });
  after(sandbox.restore);

  context('by default', function () {
    this.retries(50);

    beforeEach(function () {
      const pseudoArraySchema = {
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: this.additionalItemsSchema,
        minItems: 0,
        maxItems: 4,
      };

      this.result = defaultMocker.getCoercedItemsSchemas(pseudoArraySchema);
    });

    it('sometimes returns an array of coerced schemas with length equal to "minItems"', function () {
      expect(this.result).to.eql([]);
    });

    it('sometimes returns an array of coerced schemas with some coreced item schemas', function () {
      expect(this.result).to.eql([this.coercedItemSchema1]);
    });

    it('sometimes returns an array of coerced schemas with just coerced item schemas', function () {
      expect(this.result).to.eql([this.coercedItemSchema1, this.coercedItemSchema2]);
    });

    it('sometimes returns an array of coerced schemas with additional items with length less than "maxItems"', function () { // eslint-disable-line max-len
      expect(this.result).to.eql([this.coercedItemSchema1, this.coercedItemSchema2, this.coercedAdditionalItemsSchema]);
    });

    it('sometimes returns an array of coerced schemas with length equal to "maxItems"', function () {
      expect(this.result).to.eql([
        this.coercedItemSchema1,
        this.coercedItemSchema2,
        this.coercedAdditionalItemsSchema,
        this.coercedAdditionalItemsSchema,
      ]);
    });
  });
});
