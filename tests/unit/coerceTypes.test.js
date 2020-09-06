const { defaultMocker } = require('../../lib/mocker');

describe('coerceTypes', function () {
  const additionalSchemaKeys = Symbol('additionalSchemaKeys');

  const buildSetupResultForSchemaWithType = (type) => function () {
    this.schema = {
      type,
      additionalSchemaKeys,
    };

    this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
  };

  const itReturnsACopyOfTheSchema = () => {
    it('returns a copy of the schema', function () {
      expect(this.result).to.not.equal(this.schema);
      expect(this.result.additionalSchemaKeys).to.equal(additionalSchemaKeys);
    });
  };

  const itReturnsASchemaWithATypeArray = () => {
    it('returns a schema with an array of types', function () {
      expect(this.result.type).to.be.an('array');
    });
  };

  const itReturnsASchemaWithNullCombinedSchemas = () => {
    it('returns a schema with null combined schemas', function () {
      expect(this.result.allOf, 'allOf').to.be.null;
      expect(this.result.anyOf, 'anyOf').to.be.null;
      expect(this.result.oneOf, 'oneOf').to.be.null;
    });
  };

  context('when the schema does not have a type', function () {
    before(buildSetupResultForSchemaWithType(undefined));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'array',
        'boolean',
        'decimal',
        'integer',
        'null',
        'object',
        'string',
      ]);
    });
  });

  context('when the schema has a string type', function () {
    before(buildSetupResultForSchemaWithType('boolean'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with a single data type', function () {
      expect(this.result.type).to.eql(['boolean']);
    });
  });

  context('when the schema has a "number" type', function () {
    before(buildSetupResultForSchemaWithType('number'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with a "decimal" and "integer" data type', function () {
      expect(this.result.type).to.eql(['decimal', 'integer']);
    });
  });

  context('when the schema has a type array', function () {
    before(buildSetupResultForSchemaWithType(['array', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with a copy of the data types', function () {
      expect(this.result.type).to.eql(['array', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number"', function () {
    before(buildSetupResultForSchemaWithType(['number', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with a copy of the expanded data types', function () {
      expect(this.result.type).to.eql(['boolean', 'decimal', 'integer']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number" and "integer"', function () {
    before(buildSetupResultForSchemaWithType(['integer', 'number']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with a copy of the unique expanded types', function () {
      expect(this.result.type).to.eql(['integer', 'decimal']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schemas type field is an invalid data type', function () {
    before(buildSetupResultForSchemaWithType(false));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'array',
        'boolean',
        'decimal',
        'integer',
        'null',
        'object',
        'string',
      ]);
    });
  });

  context('when the schemas type field is an invalid string type', function () {
    before(buildSetupResultForSchemaWithType('whoops'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'array',
        'boolean',
        'decimal',
        'integer',
        'null',
        'object',
        'string',
      ]);
    });
  });

  context('when the schemas type field is an array of invalid values', function () {
    before(buildSetupResultForSchemaWithType(['whoops1', false, 3]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'array',
        'boolean',
        'decimal',
        'integer',
        'null',
        'object',
        'string',
      ]);
    });
  });

  context('when the schemas type field is an array with some valid and invalid values', function () {
    before(buildSetupResultForSchemaWithType(['string', 'whoops1', false, 'array', 3, 'object']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with the subset of valid types', function () {
      expect(this.result.type).to.eql([
        'array',
        'object',
        'string',
      ]);
    });
  });

  context('when the schemas type field is an empty array', function () {
    before(buildSetupResultForSchemaWithType([]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();
    itReturnsASchemaWithNullCombinedSchemas();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'array',
        'boolean',
        'decimal',
        'integer',
        'null',
        'object',
        'string',
      ]);
    });
  });

  context('when the schema has an "allOf"', function () {
    context('and the subschemas only support a single type', function () {
      before(function () {
        this.schema = {
          allOf: [
            {
              type: 'object',
              referenceId: 'subschema1',
            },
            {
              type: 'object',
              referenceId: 'subschema2',
            },
            {
              type: 'object',
              referenceId: 'subschema3',
            },
          ],
        };

        this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
      });

      it('returns a schema with a limited type and subschemas with coerced types', function () {
        expect(this.result).to.eql({
          type: ['object'],
          allOf: [
            {
              type: ['object'],
              referenceId: 'subschema1',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
            {
              type: ['object'],
              referenceId: 'subschema2',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
            {
              type: ['object'],
              referenceId: 'subschema3',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
          ],
          anyOf: null,
          oneOf: null,
        });
      });
    });

    context('and the subschemas support multiple types', function () {
      before(function () {
        this.schema = {
          allOf: [
            {
              type: ['array', 'boolean', 'string', 'integer'],
              referenceId: 'subschema1',
            },
            {
              type: ['boolean', 'string', 'integer', 'object', 'array'],
              referenceId: 'subschema2',
            },
            {
              type: ['null', 'string', 'boolean', 'integer', 'object'],
              referenceId: 'subschema3',
            },
          ],
        };

        this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
      });

      // eslint-disable-next-line max-len
      it('returns a schema with the intersection of all allOf types and subschemas with less limited coerced types', function () {
        expect(this.result).to.eql({
          type: ['boolean', 'integer', 'string'],
          allOf: [
            {
              type: ['array', 'boolean', 'integer', 'string'],
              referenceId: 'subschema1',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
            {
              type: ['array', 'boolean', 'integer', 'object', 'string'],
              referenceId: 'subschema2',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
            {
              type: ['boolean', 'integer', 'null', 'object', 'string'],
              referenceId: 'subschema3',
              allOf: null,
              anyOf: null,
              oneOf: null,
            },
          ],
          anyOf: null,
          oneOf: null,
        });
      });
    });
  });

  context('when the schema has an "anyOf"', function () {
    before(function () {
      this.schema = {
        anyOf: [
          {
            type: 'string',
            referenceId: 'subschema1',
          },
          {
            type: 'integer',
            referenceId: 'subschema2',
          },
          {
            type: ['boolean', 'object'],
            referenceId: 'subschema3',
          },
        ],
      };

      this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
    });

    it('returns a schema that allows any of the sub types, and has coerced subschema types', function () {
      expect(this.result).to.eql({
        type: ['boolean', 'integer', 'object', 'string'],
        allOf: null,
        anyOf: [
          {
            type: ['string'],
            referenceId: 'subschema1',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: ['integer'],
            referenceId: 'subschema2',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: ['boolean', 'object'],
            referenceId: 'subschema3',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
        ],
        oneOf: null,
      });
    });
  });

  context('when the schema has a "oneOf"', function () {
    before(function () {
      this.schema = {
        oneOf: [
          {
            type: 'string',
            referenceId: 'subschema1',
          },
          {
            type: 'integer',
            referenceId: 'subschema2',
          },
          {
            type: ['boolean', 'object'],
            referenceId: 'subschema3',
          },
        ],
      };

      this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
    });

    it('returns a schema that allows any of the sub types, and has coerced subschema types', function () {
      expect(this.result).to.eql({
        type: ['boolean', 'integer', 'object', 'string'],
        allOf: null,
        anyOf: null,
        oneOf: [
          {
            type: ['string'],
            referenceId: 'subschema1',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: ['integer'],
            referenceId: 'subschema2',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
          {
            type: ['boolean', 'object'],
            referenceId: 'subschema3',
            allOf: null,
            anyOf: null,
            oneOf: null,
          },
        ],
      });
    });
  });

  context('when the schema has nested combined schemas', function () {
    before(function () {
      this.schema = {
        allOf: [{
          allOf: [{
            type: ['boolean', 'string'],
          }],
          anyOf: [{
            type: ['boolean', 'null', 'string'],
          }],
          oneOf: [{
            type: ['boolean', 'null', 'string'],
          }],
        }],
        anyOf: [{
          allOf: [{
            type: ['array', 'null', 'string'],
          }],
          anyOf: [{
            type: ['array', 'string'],
          }],
          oneOf: [{
            type: ['array', 'null', 'string'],
          }],
        }],
        oneOf: [{
          allOf: [{
            type: ['null', 'object', 'string'],
          }],
          anyOf: [{
            type: ['null', 'object', 'string'],
          }],
          oneOf: [{
            type: ['object', 'string'],
          }],
        }],
      };

      this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
    });

    it('updates the schemas at all levels', function () {
      expect(this.result).to.eql({
        type: ['string'],
        allOf: [{
          type: ['boolean', 'string'],
          allOf: [{
            type: ['boolean', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['boolean', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['boolean', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        anyOf: [{
          type: ['array', 'string'],
          allOf: [{
            type: ['array', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['array', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['array', 'null', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
        oneOf: [{
          type: ['object', 'string'],
          allOf: [{
            type: ['null', 'object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          anyOf: [{
            type: ['null', 'object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
          oneOf: [{
            type: ['object', 'string'],
            allOf: null,
            anyOf: null,
            oneOf: null,
          }],
        }],
      });
    });
  });
});
