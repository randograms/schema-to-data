const { defaultMocker } = require('../../../lib/mocker');
const { setupCustomMocker } = require('../helpers/setupCustomMocker');

const sandbox = sinon.createSandbox();

describe('getConformedArrayKeywords/createPseudoArraySchema', function () {
  before(function () {
    this.itemSchema1 = { referenceId: 'itemSchema1' };
    this.itemSchema2 = { referenceId: 'itemSchema2' };
    this.itemSchema3 = { referenceId: 'itemSchema3' };
    this.additionalItemsSchema = { referenceId: 'additionalItemsSchema' };
    this.defaultNestedSchema = { referenceId: 'defaultNestedSchema' };
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
      arrayItemsRange: 5,
    });
    before(function () {
      const singleTypedSchema = { type: 'array' };
      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      arrayItemsRange: 7,
    });
    before(function () {
      this.itemSchema = { referenceId: 'itemSchema' };

      const singleTypedSchema = {
        type: 'array',
        items: this.itemSchema,
        additionalItems: this.additionalItemsSchema, // should be ignored
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      this.itemSchema = { referenceId: 'itemSchema' };

      const singleTypedSchema = {
        type: 'array',
        items: this.itemSchema,
      };

      this.result = testUnit(defaultMocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2, this.itemSchema3],
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        items: false,
      };

      this.result = testUnit(defaultMocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        items: false,
        minItems: 1,
      };

      const testFn = () => {
        testUnit(defaultMocker, 'createPseudoArraySchema', singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate array items for "false" literal items schema and non-zero "minItems"');
    });
  });

  context('with a list array schema with just "minItems"', function () {
    localSetupCustomMocker({
      arrayItemsRange: 5,
    });
    before(function () {
      const singleTypedSchema = {
        type: 'array',
        minItems: 4,
        items: this.itemSchema1,
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        minItems: 4,
        items: [this.itemSchema1, this.itemSchema2],
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'array',
        maxItems: 3,
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
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
      const singleTypedSchema = {
        type: 'string',
        items: [],
        minItems: 15,
        maxItems: 13,
      };

      const testFn = () => {
        testUnit(defaultMocker, 'createPseudoArraySchema', singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minItems" and "maxItems"');
    });
  });

  context('with a tuple array schema and "additionalItems"', function () {
    localSetupCustomMocker({
      minArrayItems: 1,
      maxExtraAdditionalItems: 1,
    });
    before(function () {
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: this.additionalItemsSchema,
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
    });

    it('returns a schema with the tuple items and the given additionalItems schema', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: this.additionalItemsSchema,
        minItems: 1,
        maxItems: 3,
      });
    });
  });

  context('with a "false" literal "additionalItems", a "minArrayItems" less than the length of "items" and no "minItems"', function () { // eslint-disable-line max-len
    localSetupCustomMocker({
      minArrayItems: 1,
      maxExtraAdditionalItems: 4,
    });
    before(function () {
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: false,
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
    });

    it('returns a schema with "maxItems" set to the length of the tuple', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: null,
        minItems: 1,
        maxItems: 2,
      });
    });
  });

  context('with a "false" literal "additionalItems", a "minArrayItems" greater than the length of "items" and no "minItems"', function () { // eslint-disable-line max-len
    localSetupCustomMocker({
      minArrayItems: 7,
      maxExtraAdditionalItems: 7,
    });
    before(function () {
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: false,
      };

      this.result = testUnit(this.mocker, 'createPseudoArraySchema', singleTypedSchema);
    });

    it('returns a "schema" with a "minItems" that does not exceed the length of the tuple', function () {
      expect(this.result).to.eql({
        items: [this.itemSchema1, this.itemSchema2],
        additionalItems: null,
        minItems: 2,
        maxItems: 2,
      });
    });
  });

  context('with a "false" literal "additionalItems" and "minItems" greater than the length of the tuple', function () {
    it('throws an error', function () {
      const singleTypedSchema = {
        type: 'array',
        items: [this.itemSchema1, this.itemSchema2],
        minItems: 3,
        additionalItems: false,
      };

      const testFn = () => {
        testUnit(defaultMocker, 'createPseudoArraySchema', singleTypedSchema);
      };

      expect(testFn).to.throw('Cannot generate data for conflicting "minItems" and "false" literal "additionalItems"');
    });
  });
});
