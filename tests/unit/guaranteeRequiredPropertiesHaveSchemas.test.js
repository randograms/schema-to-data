const { defaultMocker } = require('../../lib/mocker');

describe('guaranteeRequiredPropertiesHaveSchemas', function () {
  before(function () {
    this.propertySchema2 = Symbol('propertySchema2');
    this.additionalPropertiesSchema = Symbol('additionalPropertiesSchema');

    this.pseudoObjectSchema = {
      propertiesSchemas: {
        property2: this.propertySchema2,
        property4: true,
        property5: false,
      },
      propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4', 'property5'],
      shuffledOptionalPropertyNames: [],
      additionalPropertiesSchema: this.additionalPropertiesSchema,
      minProperties: Symbol('minProperties'),
      maxProperties: Symbol('maxProperties'),
    };

    this.result = defaultMocker.guaranteeRequiredPropertiesHaveSchemas(this.pseudoObjectSchema);
  });

  it('returns undefined', function () {
    expect(this.result).to.be.undefined;
  });

  it('updates propertiesSchemas to have a definition for every required property', function () {
    expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
      property1: this.additionalPropertiesSchema,
      property2: this.propertySchema2,
      property3: this.additionalPropertiesSchema,
      property4: true,
      property5: false,
    });
  });
});
