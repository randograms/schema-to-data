const _ = require('lodash');
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

  context('when the schema does not have a type', function () {
    before(buildSetupResultForSchemaWithType(undefined));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schema has a string type', function () {
    before(buildSetupResultForSchemaWithType('boolean'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a single data type', function () {
      expect(this.result.type).to.eql(['boolean']);
    });
  });

  context('when the schema has a "number" type', function () {
    before(buildSetupResultForSchemaWithType('number'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a "decimal" and "integer" data type', function () {
      expect(this.result.type).to.eql(['decimal', 'integer']);
    });
  });

  context('when the schema has a type array', function () {
    before(buildSetupResultForSchemaWithType(['array', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the data types', function () {
      expect(this.result.type).to.eql(['array', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number"', function () {
    before(buildSetupResultForSchemaWithType(['number', 'boolean']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the expanded data types', function () {
      expect(this.result.type).to.eql(['decimal', 'integer', 'boolean']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schema has a type array that includes "number" and "integer"', function () {
    before(buildSetupResultForSchemaWithType(['integer', 'number']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with a copy of the unique expanded types', function () {
      expect(this.result.type).to.eql(['integer', 'decimal']);
      expect(this.result.type).to.not.equal(this.schema.type);
    });
  });

  context('when the schemas type field is an invalid data type', function () {
    before(buildSetupResultForSchemaWithType(false));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an invalid string type', function () {
    before(buildSetupResultForSchemaWithType('whoops'));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an array of invalid values', function () {
    before(buildSetupResultForSchemaWithType(['whoops1', false, 3]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an array with some valid and invalid values', function () {
    before(buildSetupResultForSchemaWithType(['string', 'whoops1', false, 'array', 3, 'object']));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with the subset of valid types', function () {
      expect(this.result.type).to.eql([
        'string',
        'array',
        'object',
      ]);
    });
  });

  context('when the schemas type field is an empty array', function () {
    before(buildSetupResultForSchemaWithType([]));

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with all data types', function () {
      expect(this.result.type).to.eql([
        'null',
        'string',
        'decimal',
        'integer',
        'boolean',
        'array',
        'object',
      ]);
    });
  });

  context('when the schema has an allOf with an allOf', function () {
    before(function () {
      this.schema = {
        allOf: [
          { type: ['string', 'boolean', 'number'] },
          {
            type: ['array', 'object', 'string', 'boolean', 'integer'],
            allOf: { type: ['number', 'object', 'string', 'boolean'] },
          },
          { type: ['null', 'boolean', 'string', 'integer'] },
        ],
        additionalSchemaKeys,
      };

      this.result = testUnit(defaultMocker, 'coerceTypes', this.schema);
    });

    itReturnsACopyOfTheSchema();
    itReturnsASchemaWithATypeArray();

    it('returns a schema with the intersection of all allOf types', function () {
      expect(this.result.type).to.eql([
        'string',
        'integer',
        'boolean',
      ]);
    });
  });

  context('when the schema has an anyOf which can support multiple types', function () {
    before(function () {
      this.schema = {
        anyOf: [
          { type: ['string', 'boolean'] },
          { type: ['string', 'integer'] },
          { type: ['boolean', 'integer'] },
        ],
        additionalSchemaKeys,
      };

      const results = _.times(50, () => testUnit(defaultMocker, 'coerceTypes', this.schema));
      this.resultTypes = _.map(results, 'type');
    });

    const expectedTypes = [
      ['string'],
      ['boolean'],
      ['integer'],
      ['string', 'boolean'],
      ['string', 'integer'],
      ['string', 'boolean'],
    ];

    expectedTypes.forEach((expectedType, index) => {
      it(`sometimes returns a schema with the type: ${expectedType.join()}`, function () {
        expect(this.resultTypes, `case ${index} failed`).to.include.something.that.eqls(expectedType);
      });
    });
  });

  context('when the schema has an anyOf with an anyOf', function () {
    before(function () {
      this.schema = {
        anyOf: [
          {
            anyOf: [
              { type: 'string' },
              { type: 'boolean' },
            ],
          },
        ],
        additionalSchemaKeys,
      };

      const results = _.times(30, () => testUnit(defaultMocker, 'coerceTypes', this.schema));
      this.resultTypes = _.map(results, 'type');
    });

    it('sometimes returns a schema with one supported type', function () {
      expect(this.resultTypes).to.include.something.that.eqls(['string']);
    });

    it('sometimes returns a schema with a different supported type', function () {
      expect(this.resultTypes).to.include.something.that.eqls(['boolean']);
    });
  });

  // "shallow" is used by the merging logic to allow reuse of coerceTypes without having to traverse again
  context('when the "shallow" option is enabled', function () {
    before(function () {
      const schema = {
        allOf: [
          { type: ['string', 'boolean'] },
          { type: ['integer', 'boolean'] },
        ],
        anyOf: [
          { type: 'string' },
          { type: 'boolean' },
          { type: 'integer' },
        ],
      };

      // only this test should call the function directly without using `testUnit`
      const { coerceTypes } = require('../../lib/coerceTypes'); // eslint-disable-line global-require

      this.result = coerceTypes(schema, { shallow: true });
    });

    it('ignores combined schemas', function () {
      expect(this.result.type).to.eql(['null', 'string', 'decimal', 'integer', 'boolean', 'array', 'object']);
    });
  });
});
