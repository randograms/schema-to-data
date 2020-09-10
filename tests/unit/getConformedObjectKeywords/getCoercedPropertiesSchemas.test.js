const { defaultMocker } = require('../../../lib/mocker');

const sandbox = sinon.createSandbox();

describe('getConformedObjectKeywords/getCoercedPropertiesSchemas', function () {
  before(function () {
    this.propertySchema1 = { referenceId: 'propertySchema1' };
    this.propertySchema2 = { referenceId: 'propertySchema2' };
    this.propertySchema3 = { referenceId: 'propertySchema3' };
    this.propertySchema4 = { referenceId: 'propertySchema4' };

    this.coercedPropertySchema1 = { referenceId: 'propertySchema1' };
    this.coercedPropertySchema2 = { referenceId: 'propertySchema2' };
    this.coercedPropertySchema3 = { referenceId: 'propertySchema3' };
    this.coercedPropertySchema4 = { referenceId: 'propertySchema4' };

    const stub = sandbox.stub(defaultMocker, 'coerceSchema');
    stub.withArgs(this.propertySchema1).returns(this.coercedPropertySchema1);
    stub.withArgs(this.propertySchema2).returns(this.coercedPropertySchema2);
    stub.withArgs(this.propertySchema3).returns(this.coercedPropertySchema3);
    stub.withArgs(this.propertySchema4).returns(this.coercedPropertySchema4);
  });
  after(sandbox.restore);

  context('when the schema does not have properties', function () {
    before(function () {
      const pseudoObjectSchema = {
        patternPropertiesSchemas: null,
        propertyNamesSchema: null,
        propertiesSchemas: {},
        propertyNamesToGenerate: [],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: { referenceId: 'additionalPropertiesSchema' },
        minProperties: { referenceId: 'minProperties' },
        maxProperties: { referenceId: 'maxProperties' },
      };

      this.result = testUnit(defaultMocker, 'getCoercedPropertiesSchemas', pseudoObjectSchema);
    });

    it('returns an empty object', function () {
      expect(this.result).to.eql({});
    });
  });

  context('when the schema has more properties defined than need to be generated', function () {
    before(function () {
      const pseudoObjectSchema = {
        patternPropertiesSchemas: null,
        propertyNamesSchema: null,
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
        additionalPropertiesSchema: { referenceId: 'additionalPropertiesSchema' },
        minProperties: { referenceId: 'minProperties' },
        maxProperties: { referenceId: 'maxProperties' },
      };

      this.result = testUnit(defaultMocker, 'getCoercedPropertiesSchemas', pseudoObjectSchema);
    });

    it('returns coercedPropertiesSchemas for just the properties that need to be generated', function () {
      expect(this.result).to.eql({
        property1: this.coercedPropertySchema1,
        property2: this.coercedPropertySchema2,
      });
    });
  });
});
