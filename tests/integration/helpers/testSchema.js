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
  ...unsupportedOptions
} = {}) => {
  const ignoreSchemaValidation = expectedSchemaValidationError !== null;

  if (!description) {
    throw Error('"description" must be provided');
  }

  const itThrowsAnError = () => {
    it(`throws "${expectedError}"`, function () {
      const testFn = () => {
        schemaToData(schema);
      };

      expect(testFn).to.throw(expectedError);
    });
  };

  const itReturnsValidData = () => {
    it('returns valid data', function () {
      const runCount = 10;

      const failures = _.range(runCount)
        .map((index) => {
          let mockData;
          let errors;
          try {
            mockData = schemaToData(schema);

            if (debug) {
              console.log(mockData); // eslint-disable-line no-console
            }

            const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;

            if (ignoreSchemaValidation) {
              const testFn = () => {
                regularValidator.validate(schema, mockData);
              };

              expect(testFn, 'Schema failed validation for the wrong reason').to.throw(expectedSchemaValidationError);
            }

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

  const contextMethod = only ? context.only : context;
  contextMethod(description, function () {
    before(function () {
      if (!schema) {
        throw Error('"schema" must be provided');
      }

      if (!_.isEmpty(unsupportedOptions)) {
        throw Error(`"testSchema" was called with unsupported options: ${_.keys(unsupportedOptions)}`);
      }
    });

    after(function () {
      if (only) {
        throw Error('"testSchema" was run with "only"');
      }
    });

    if (expectedError) {
      itThrowsAnError();
    } else {
      itReturnsValidData();
    }
  });
};

testSchema.only = (options) => testSchema({ ...options, only: true });

module.exports = { testSchema };
