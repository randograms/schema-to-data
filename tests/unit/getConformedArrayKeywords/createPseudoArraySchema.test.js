const { defaultMocker } = require('../../../lib/mocker');
const { setupCustomMocker } = require('../helpers/setupCustomMocker');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ ...additionalSchemaKeys } = {}) => ({
  ...additionalSchemaKeys,
  type: 'array',
});

describe('getConformedArrayKeywords/createPseudoArraySchema', function () {
  before(function () {
    this.itemSchema1 = Symbol('itemSchema1');
    this.itemSchema2 = Symbol('itemSchema2');
    this.itemSchema3 = Symbol('itemSchema3');
    this.defaultNestedSchema = Symbol('defaultNestedSchema');
    sandbox.stub(defaultMocker, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
  });
  after(sandbox.restore);

  const localSetupCustomMocker = (options) => {
    setupCustomMocker(options);
    before(function () {
      sinon.stub(this.mocker, 'generateDefaultNestedSchema').returns(this.defaultNestedSchema);
    });
  };

  context('without any relevant keywords', function () {
    localSetupCustomMocker({
      minArrayItems: 3,
      arrayLengthRange: 5,
    });
    before(function () {
      this.itemSchema = Symbol('itemSchema');

      const singleTypedSchema = generateValidTestSchema();

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns an array schema with default values', function () {
      expect(this.result).to.eql({
        items: [this.defaultNestedSchema],
        additionalItems: this.defaultNestedSchema,
        minItems: 3,
        maxItems: 8,
      });
    });
  });

  context('with a list array schema', function () {
    localSetupCustomMocker({
      minArrayItems: 2,
      arrayLengthRange: 7,
    });
    before(function () {
      this.itemSchema = Symbol('itemSchema');

      const singleTypedSchema = generateValidTestSchema({
        items: this.itemSchema,
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns an array schema with the item schema as the items tuple and the additionalItems along with defult min and max items', function () { // eslint-disable-line max-len
      expect(this.result).to.eql({
        items: [this.itemSchema],
        additionalItems: this.itemSchema,
        minItems: 2,
        maxItems: 9,
      });
    });
  });

  context('with a list array schema and the defaultMocker', function () {
    before(function () {
      this.itemSchema = Symbol('itemSchema');

      const singleTypedSchema = generateValidTestSchema({
        items: this.itemSchema,
      });

      this.result = defaultMocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns an array schema with the item schema as the items tuple and the additionalItems along with defult min and max items', function () { // eslint-disable-line max-len
      expect(this.result).to.eql({
        items: [this.itemSchema],
        additionalItems: this.itemSchema,
        minItems: 0,
        maxItems: 20,
      });
    });
  });

  context('with a tuple array schema whose length is less than the default "minArrayItems"', function () {
    localSetupCustomMocker({
      minArrayItems: 5,
      maxExtraAdditionalItems: 3,
    });
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with tuple items and a default additionalItems along with adjusted length keywords', function () { // eslint-disable-line max-len
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        additionalItems: this.defaultNestedSchema,
        minItems: 5,
        maxItems: 8,
      });
    });
  });

  context('with a tuple array schema whose length is greater than the default "minArrayItems"', function () { // eslint-disable-line max-len
    localSetupCustomMocker({
      minArrayItems: 1,
      maxExtraAdditionalItems: 2,
    });
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with tuple items and a default additionalItems along with adjusted length keywords', function () { // eslint-disable-line max-len
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
        additionalItems: this.defaultNestedSchema,
        minItems: 1,
        maxItems: 5,
      });
    });
  });

  context('with an array schema with a "false" literal items schema', function () {
    localSetupCustomMocker({
      minArrayItems: 4,
    });
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

  context('with a list array schema with just "minItems"', function () {
    localSetupCustomMocker({
      arrayLengthRange: 5,
    });
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        minItems: 4,
        items: this.itemSchema1,
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with "minItems" and "maxItems"', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1],
        minItems: 4,
        maxItems: 9,
        additionalItems: this.itemSchema1,
      });
    });
  });

  context('with a tuple array schema with just "minItems"', function () {
    localSetupCustomMocker({
      maxExtraAdditionalItems: 3,
    });
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        minItems: 4,
        items: [this.itemSchema1, this.itemSchema2],
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with "minItems" and "maxItems"', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2],
        minItems: 4,
        maxItems: 7,
        additionalItems: this.defaultNestedSchema,
      });
    });
  });

  context('when "maxItems" is less than the default "minArrayItems"', function () {
    localSetupCustomMocker({
      minArrayItems: 5,
    });
    before(function () {
      const singleTypedSchema = generateValidTestSchema({
        maxItems: 3,
      });

      this.result = this.mocker.createPseudoArraySchema(singleTypedSchema);
    });

    it('returns a schema with an adjusted "minItems"', function () {
      expect(this.result).to.eql({
        items: [this.defaultNestedSchema],
        minItems: 3,
        maxItems: 3,
        additionalItems: this.defaultNestedSchema,
      });
    });
  });

  context('with conflicting "minItems" and "maxItems"', function () {
    it('throws an error', function () {
      const testFn = () => {
        const pseudoArraySchema = generateValidTestSchema({
          items: [],
          minItems: 15,
          maxItems: 13,
        });
        defaultMocker.createPseudoArraySchema(pseudoArraySchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minItems" and "maxItems"');
    });
  });
});
