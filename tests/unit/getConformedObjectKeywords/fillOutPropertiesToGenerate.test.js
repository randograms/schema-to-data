const _ = require('lodash');
const { defaultMocker } = require('../../../lib/mocker');
const { setupCustomMocker } = require('../helpers/setupCustomMocker');

const sandbox = sinon.createSandbox();

describe('getConformedObjectKeywords/fillOutPropertiesToGenerate', function () {
  before(function () {
    this.propertySchema1 = { referenceId: 'propertySchema1' };
    this.propertySchema2 = { referenceId: 'propertySchema2' };
    this.propertySchema3 = { referenceId: 'propertySchema3' };
    this.propertySchema4 = { referenceId: 'propertySchema4' };
    this.propertySchema5 = { referenceId: 'propertySchema5' };
    this.additionalPropertiesSchema = { referenceId: 'additionalPropertiesSchema' };
  });

  context('when "optionalPropertyPrioritization" is 0', function () {
    setupCustomMocker({ optionalPropertyPrioritization: 0 });

    before(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
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
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 6,
        maxProperties: 6,
      };

      testUnit(this.mocker, 'fillOutPropertiesToGenerate', this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('does not remove properties from "shuffledOptionalPropertyNames"', function () {
      expect(this.pseudoObjectSchema.shuffledOptionalPropertyNames).to.eql(['property3', 'property4']);
    });

    it('appends additional properties to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        property3: this.propertySchema3,
        property4: this.propertySchema4,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
        additionalProperty3: this.additionalPropertiesSchema,
        additionalProperty4: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'additionalProperty1',
        'additionalProperty2',
        'additionalProperty3',
        'additionalProperty4',
      ]);
    });
  });

  context('when "optionalPropertyPrioritization" is 1', function () {
    setupCustomMocker({ optionalPropertyPrioritization: 1 });

    before(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
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
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 6,
        maxProperties: 6,
      };

      testUnit(this.mocker, 'fillOutPropertiesToGenerate', this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('removes properties from "shuffledOptionalPropertyNames"', function () {
      expect(this.pseudoObjectSchema.shuffledOptionalPropertyNames).to.eql([]);
    });

    it('appends additional properties to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        property3: this.propertySchema3,
        property4: this.propertySchema4,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'property3',
        'property4',
        'additionalProperty1',
        'additionalProperty2',
      ]);
    });
  });

  // regression
  context('when a duplicate additional property name is generated', function () {
    before(function () {
      const stub = sandbox.stub(defaultMocker, 'generateAdditionalPropertyName');
      stub.onFirstCall().returns('additionalProperty1');
      stub.onSecondCall().returns('additionalProperty1');
      stub.onThirdCall().returns('additionalProperty2');

      this.pseudoObjectSchema = {
        patternPropertiesSchemas: null,
        propertyNamesSchema: null,
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 4,
        maxProperties: 4,
      };

      testUnit(defaultMocker, 'fillOutPropertiesToGenerate', this.pseudoObjectSchema);
    });
    after(sandbox.restore);

    it('continues to generate additional properties to append to "propertiesSchemas"', function () {
      expect(this.pseudoObjectSchema.propertiesSchemas).to.eql({
        property1: this.propertySchema1,
        property2: this.propertySchema2,
        additionalProperty1: this.additionalPropertiesSchema,
        additionalProperty2: this.additionalPropertiesSchema,
      });
    });

    it('appends additional property names to "propertyNamesToGenerate"', function () {
      expect(this.pseudoObjectSchema.propertyNamesToGenerate).to.eql([
        'property1',
        'property2',
        'additionalProperty1',
        'additionalProperty2',
      ]);
    });
  });

  context('when "optionalPropertyPrioritization" is between 0 and 1 and the object size can vary', function () {
    this.retries(50);
    setupCustomMocker({ optionalPropertyPrioritization: 0.5 });

    beforeEach(function () {
      sandbox.stub(this.mocker, 'generateAdditionalPropertyName').callsFake(() => (
        `additionalProperty${this.mocker.generateAdditionalPropertyName.callCount}`
      ));

      this.pseudoObjectSchema = {
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
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 2,
        maxProperties: 4,
      };

      testUnit(this.mocker, 'fillOutPropertiesToGenerate', this.pseudoObjectSchema);

      this.assertionResult = _.pick(this.pseudoObjectSchema, [
        'propertiesSchemas',
        'propertyNamesToGenerate',
        'shuffledOptionalPropertyNames',
      ]);
    });
    afterEach(sandbox.restore);

    it('sometimes does not append any more properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
      });
    });

    it('sometimes only appends optional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4'],
        shuffledOptionalPropertyNames: [],
      });
    });

    it('sometimes appends optional and additional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'additionalProperty1'],
        shuffledOptionalPropertyNames: ['property4'],
      });
    });

    it('sometimes appends additional and optional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'additionalProperty1', 'property3'],
        shuffledOptionalPropertyNames: ['property4'],
      });
    });

    it('sometimes only appends additional properties', function () {
      expect(this.assertionResult).to.eql({
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
          additionalProperty1: this.additionalPropertiesSchema,
          additionalProperty2: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'additionalProperty1', 'additionalProperty2'],
        shuffledOptionalPropertyNames: ['property3', 'property4'],
      });
    });
  });

  context('when "additionalPropertiesSchema" is null (regardless of "optionalPropertyPrioritization")', function () {
    setupCustomMocker({ optionalPropertyPrioritization: 0 });

    before(function () {
      this.results = _.times(10, () => {
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
          additionalPropertiesSchema: null,
          minProperties: 4,
          maxProperties: 4,
        };

        return testUnit(this.mocker, 'fillOutPropertiesToGenerate', pseudoObjectSchema);
      });
    });

    it('always uses the optional properties instead of generated additional properties', function () {
      expect(this.results).to.all.eql({
        patternPropertiesSchemas: null,
        propertyNamesSchema: null,
        propertiesSchemas: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
          property3: this.propertySchema3,
          property4: this.propertySchema4,
        },
        propertyNamesToGenerate: ['property1', 'property2', 'property3', 'property4'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: null,
        minProperties: 4,
        maxProperties: 4,
      });
    });
  });

  context('when "propertyNamesSchema" is not null', function () {
    before(function () {
      const stub = sandbox.stub(defaultMocker, 'schemaToData');
      const expectedPropertyNamesSchema = {
        type: 'string',
        referenceId: 'propertyNamesSchema',
      };
      stub.withArgs(expectedPropertyNamesSchema).onFirstCall().returns('abc');
      stub.withArgs(expectedPropertyNamesSchema).onSecondCall().returns('def');

      this.result = testUnit(
        defaultMocker,
        'fillOutPropertiesToGenerate',
        {
          propertyNamesSchema: { referenceId: 'propertyNamesSchema' },
          patternPropertiesSchemas: null,
          propertiesSchemas: {},
          propertyNamesToGenerate: [],
          shuffledOptionalPropertyNames: [],
          additionalPropertiesSchema: this.additionalPropertiesSchema,
          minProperties: 2,
          maxProperties: 2,
        },
      );
    });
    after(sandbox.restore);

    it('generates additional property names that match the pattern', function () {
      expect(this.result).to.eql({
        propertyNamesSchema: { referenceId: 'propertyNamesSchema' },
        patternPropertiesSchemas: null,
        propertiesSchemas: {
          abc: this.additionalPropertiesSchema,
          def: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['abc', 'def'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 2,
        maxProperties: 2,
      });
    });
  });

  context('when "propertyNamesSchema" and "patternPropertiesSchemas" are not null', function () {
    before(function () {
      const stub = sandbox.stub(defaultMocker, 'schemaToData');
      const expectedPropertyNamesSchema = {
        type: 'string',
        referenceId: 'propertyNamesSchema',
      };
      stub.withArgs(expectedPropertyNamesSchema).onFirstCall().returns('abc');
      stub.withArgs(expectedPropertyNamesSchema).onSecondCall().returns('def');
      stub.withArgs(expectedPropertyNamesSchema).onThirdCall().returns('ghi');

      this.result = testUnit(
        defaultMocker,
        'fillOutPropertiesToGenerate',
        {
          propertyNamesSchema: { referenceId: 'propertyNamesSchema' },
          patternPropertiesSchemas: {
            bc: this.propertySchema1,
            ef: this.propertySchema2,
          },
          propertiesSchemas: {},
          propertyNamesToGenerate: [],
          shuffledOptionalPropertyNames: [],
          additionalPropertiesSchema: this.additionalPropertiesSchema,
          minProperties: 3,
          maxProperties: 3,
        },
      );
    });
    after(sandbox.restore);

    it('uses the patternProperties schema if the random name matches a pattern', function () {
      expect(this.result).to.eql({
        propertyNamesSchema: { referenceId: 'propertyNamesSchema' },
        patternPropertiesSchemas: {
          bc: this.propertySchema1,
          ef: this.propertySchema2,
        },
        propertiesSchemas: {
          abc: this.propertySchema1,
          def: this.propertySchema2,
          ghi: this.additionalPropertiesSchema,
        },
        propertyNamesToGenerate: ['abc', 'def', 'ghi'],
        shuffledOptionalPropertyNames: [],
        additionalPropertiesSchema: this.additionalPropertiesSchema,
        minProperties: 3,
        maxProperties: 3,
      });
    });
  });
});
