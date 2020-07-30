const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('getCoercedItemsSchemas', function () {
  before(function () {
    this.itemSchema1 = Symbol('itemSchema1');
    this.itemSchema2 = Symbol('itemSchema2');
    this.itemSchema3 = Symbol('itemSchema3');
    this.additionalItemsSchema = Symbol('additionalItemsSchema');

    this.coercedItemSchema1 = Symbol('coercedItemSchema1');
    this.coercedItemSchema2 = Symbol('coercedItemSchema2');
    this.coercedItemSchema3 = Symbol('coercedItemSchema3');
    this.coercedAdditionalItemsSchema = Symbol('coercedAdditionalItemsSchema');

    const stub = sandbox.stub(defaultMocker, 'coerceSchema');
    stub.withArgs(this.itemSchema1).returns(this.coercedItemSchema1);
    stub.withArgs(this.itemSchema2).returns(this.coercedItemSchema2);
    stub.withArgs(this.itemSchema3).returns(this.coercedItemSchema3);
    stub.withArgs(this.additionalItemsSchema).returns(this.coercedAdditionalItemsSchema);
  });
  after(sandbox.restore);

  context('by default', function () {
    this.retries(50);

    beforeEach(function () {
      const pseudoArraySchema = {
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        additionalItems: this.additionalItemsSchema,
      };

      this.result = defaultMocker.getCoercedItemsSchemas(pseudoArraySchema);
    });

    it('sometimes returns a schema with an empty items tuple', function () {
      expect(this.result).to.eql([]);
    });

    it('sometimes returns a schema with just the defined items', function () {
      expect([
        [this.coercedItemSchema1],
        [this.coercedItemSchema1, this.coercedItemSchema2],
        [this.coercedItemSchema1, this.coercedItemSchema2, this.coercedItemSchema3],
      ]).to.include.something.that.eqls(this.result);
    });

    it('sometimes returns a schema with additional items', function () {
      expect(this.result).to.eql([
        this.coercedItemSchema1,
        this.coercedItemSchema2,
        this.coercedItemSchema3,
        this.coercedAdditionalItemsSchema,
        this.coercedAdditionalItemsSchema,
      ]);
    });
  });

  context('that has "minItems"', function () {
    beforeEach(function () {
      const pseudoArraySchema = {
        items: [this.itemSchema1],
        additionalItems: this.additionalItemsSchema,
        minItems: 5,
      };

      this.results = _.times(50, () => defaultMocker.getCoercedItemsSchemas(pseudoArraySchema));
    });

    it('always returns a conformedSchema with at least "minItems" item schemas', function () {
      expect(this.results).to.all.satisfy((coercedItems) => coercedItems.length >= 5);
    });

    it('sometimes returns a conformedSchema with "minItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 5);
    });

    it('sometimes returns a conformedSchema with more than "minItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length > 5);
    });
  });

  context('that has "minItems" which exceeds the default "maxItems"', function () {
    beforeEach(function () {
      const pseudoArraySchema = {
        items: [this.itemSchema1],
        additionalItems: this.additionalItemsSchema,
        minItems: 100,
      };

      this.results = _.times(50, () => defaultMocker.getCoercedItemsSchemas(pseudoArraySchema));
    });

    it('always returns a conformedSchema with at least "minItems" item schemas', function () {
      expect(this.results).to.all.satisfy((coercedItems) => coercedItems.length >= 100);
    });

    it('sometimes returns a conformedSchema with "minItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 100);
    });

    it('sometimes returns a conformedSchema with more than "minItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length > 100);
    });
  });

  context('that has "maxItems"', function () {
    beforeEach(function () {
      const pseudoArraySchema = {
        type: 'array',
        items: [this.itemSchema1],
        additionalItems: this.additionalItemsSchema,
        maxItems: 3,
      };

      this.results = _.times(50, () => defaultMocker.getCoercedItemsSchemas(pseudoArraySchema));
    });

    it('always returns a conformedSchema with items with length less than or equal to "maxItems"', function () {
      expect(this.results).to.all.satisfy((coercedItems) => coercedItems.length <= 3);
    });

    it('sometimes returns a conformedSchema with zero items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 0);
    });

    it('sometimes returns a conformedSchema with "maxItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 3);
    });

    it('sometimes returns a conformedSchema with items with length between zero and "maxItems"', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length > 0 && coercedItems.length < 5);
    });
  });

  context('that has "minItems" and "maxItems"', function () {
    beforeEach(function () {
      const pseudoArraySchema = {
        type: 'array',
        items: [this.itemSchema1],
        additionalItems: this.additionalItemsSchema,
        minItems: 3,
        maxItems: 7,
      };

      this.results = _.times(50, () => defaultMocker.getCoercedItemsSchemas(pseudoArraySchema));
    });

    it('always returns a conformedSchema with items with length between "minItems" and "maxItems"', function () {
      expect(this.results).to.all.satisfy((coercedItems) => (
        coercedItems.length >= 3
        && coercedItems.length <= 7
      ));
    });

    it('sometimes returns a conformedSchema with "minItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 3);
    });

    it('sometimes returns a conformedSchema with "maxItems" items', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length === 7);
    });

    it('sometimes returns a conformedSchema with items with length between "minItems" and "maxItems"', function () {
      expect(this.results).to.include.something
        .that.satisfies((coercedItems) => coercedItems.length > 3 && coercedItems.length < 7);
    });
  });

  context('that has conflicting "minItems" and "maxItems"', function () {
    it('throws an error', function () {
      const testFn = () => {
        const pseudoArraySchema = {
          type: 'array',
          items: [],
          minItems: 15,
          maxItems: 13,
        };
        defaultMocker.getCoercedItemsSchemas(pseudoArraySchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minItems" and "maxItems"');
    });
  });
});
