const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

describe('generateData', function () {
  context('with a null conformed schema without "const" or "enum"', function () {
    it('returns null', function () {
      const conformedSchema = {
        type: 'null',
        const: undefined,
        enum: null,
      };
      const data = testUnit(defaultMocker, 'generateData', conformedSchema);

      expect(data).to.be.null;
    });
  });

  [
    {
      type: 'array',
      enum: [[1], ['a'], [true]],
      items: [],
    },
    {
      type: 'boolean',
      enum: [true, true, false],
    },
    {
      type: 'decimal',
      enum: [1.1, 2, 2.1],
      minimum: 0,
      maximum: 10,
    },
    {
      type: 'integer',
      enum: [1.1, 2, 2.1],
      minimum: 0,
      maximum: 10,
    },
    {
      type: 'null',
      enum: [null, null, null],
    },
    {
      type: 'object',
      enum: [
        { value: 'a' },
        { value: 1 },
        { value: true },
      ],
      properties: {},
    },
    {
      type: 'string',
      enum: ['a', 'b', 'c'],
      format: null,
      pattern: null,
      maxLength: 0,
      minLength: 10,
    },
  ].forEach((schema) => {
    describe(`with a conformed schema with type "${schema.type}"`, function () {
      context('and "const"', function () {
        const constValue = { value: 1 };

        before(function () {
          const conformedSchema = {
            ...schema,
            enum: null,
            const: constValue,
          };
          this.results = _.times(10, () => testUnit(defaultMocker, 'generateData', conformedSchema));
        });

        it('always returns a copy of the constant value', function () {
          expect(this.results).to.all.eql(constValue);
          expect(this.results).to.all.not.equal(constValue);
        });
      });

      context('and "enum"', function () {
        before(function () {
          const conformedSchema = {
            ...schema,
            const: undefined,
          };

          this.results = _.times(30, () => testUnit(defaultMocker, 'generateData', conformedSchema));
        });

        it('always returns a value from the enum', function () {
          expect(this.results).to.all.satisfy((result) => (
            _.findIndex(schema.enum, (enumValue) => _.isEqual(result, enumValue)) !== -1
          ));
        });

        it('sometimes returns the first enum value', function () {
          expect(this.results).to.include.something.that.eqls(schema.enum[0]);
        });

        it('sometimes returns the second enum value', function () {
          expect(this.results).to.include.something.that.eqls(schema.enum[1]);
        });

        it('sometimes returns the third enum value', function () {
          expect(this.results).to.include.something.that.eqls(schema.enum[2]);
        });

        if (schema.type === 'array' || schema.type === 'object') {
          it('returns a copy of the enum value', function () {
            expect(this.results).to.all.not.equal(schema.enum[0]);
            expect(this.results).to.all.not.equal(schema.enum[1]);
            expect(this.results).to.all.not.equal(schema.enum[2]);
          });
        }
      });
    });
  });
});
