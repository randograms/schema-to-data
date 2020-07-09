const _ = require('lodash');
const Ajv = require('ajv');
const { schemaToData } = require('../../..');

const regularValidator = new Ajv();
const edgeCaseValidator = new Ajv({ validateSchema: false });

const testSchema = ({
  description,
  schema,
  expectedSchemaValidationError = null,
  expectedError = null,
  debug = false,
  only = false,
  skip = false,
  ...unsupportedOptions
} = {}) => {
  const runCount = 10;
  const ignoreSchemaValidation = expectedSchemaValidationError !== null;

  if (!description) {
    throw Error('"testSchema" must be given a "description"');
  }

  const itThrowsTheExpectedError = () => {
    it(`throws "${expectedError}"`, function () {
      expect(() => schemaToData(schema)).to.throw(expectedError);
    });
  };

  const saveResults = function () {
    this.results = _.range(runCount)
      .map((runIndex) => {
        let mockData;
        let errors = null;
        try {
          mockData = schemaToData(schema);
          const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;

          if (!validator.validate(schema, mockData)) errors = validator.errorsText();
        } catch (error) {
          errors = error.message;
        }

        return {
          runIndex,
          errors,
          mockData,
        };
      });
  };

  const itReturnsValidData = () => {
    it('returns valid data', function () {
      const failures = this.results
        .map((index) => {
          let mockData;
          let errors;
          try {
            mockData = schemaToData(schema);

            if (debug) {
              console.log(mockData); // eslint-disable-line no-console
            }

            const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;
            if (validator.validate(schema, mockData)) return null;

            errors = validator.errorsText();
          } catch (error) {
            errors = error.message;
          }

          return {
            index,
            errors,
            mockData,
          };
        })
        .filter((result) => result !== null);

      if (failures.length > 0) {
        const errorMessage = [
          `${failures.length}/${runCount} runs failed`,
          ...failures.map(({ index, errors, mockData }) => `${index}: ${errors} | ${JSON.stringify(mockData)}`),
        ].join('\n');

        throw Error(errorMessage);
      }
    });
  };

  let contextMethod = only ? context.only : context;
  contextMethod = skip ? context.skip : contextMethod;
    before(function () {
      if (!schema) {
        throw Error('"schema" must be provided');
      }

      if (!_.isEmpty(unsupportedOptions)) {
        throw Error(`"testSchema" was called with unsupported options: ${_.keys(unsupportedOptions)}`);
      }

      if (ignoreSchemaValidation) {
        const isSchemaValid = regularValidator.validateSchema(schema);

        if (isSchemaValid) {
          throw Error('Expected schema to be invalid');
        }

        if (!isSchemaValid) {
          expect(
            regularValidator.errorsText(),
            'Schema failed validation for the wrong reason',
          ).to.include(expectedSchemaValidationError);
        }
      }
    });

    after(function () {
      if (only) {
        throw Error('"testSchema" was run with "only"');
      }
    });

    if (expectedError !== null) {
      itThrowsTheExpectedError();
      return;
    }

    before(saveResults);
    itReturnsValidData();
  });
};

testSchema.only = (options) => testSchema({ ...options, only: true });
testSchema.skip = (options) => testSchema({ ...options, skip: true });

module.exports = { testSchema };
