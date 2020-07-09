const _ = require('lodash');
const Ajv = require('ajv');
const { blue, reset, red } = require('ansi-colors');
const { schemaToData } = require('../../..');

const regularValidator = new Ajv();
const edgeCaseValidator = new Ajv({ validateSchema: false });

const testSchema = ({
  scenario,
  schema: inputSchema,
  theSchemaIsInvalidBecause: expectedSchemaValidationError = null,
  itThrowsTheError: expectedError = null,
  debug = process.env.DEBUG === 'true',
  only = false,
  skip = false,
  ...unsupportedOptions
} = {}) => {
  const runCount = 10;
  const ignoreSchemaValidation = expectedSchemaValidationError !== null;

  if (!scenario) {
    throw Error('"testSchema" must be given a "scenario"');
  }

  const itThrowsTheExpectedError = () => {
    it(`throws "${expectedError}"`, function () {
      expect(() => schemaToData(inputSchema)).to.throw(expectedError);
    });
  };

  const reportResults = ({
    customizedResults,
    onlyPrintFailures = true,
  } = {}) => {
    const failures = customizedResults.filter(({ errors }) => errors !== null);
    const testPassed = failures.length === 0;

    if (testPassed && onlyPrintFailures) {
      return;
    }

    const filteredResults = onlyPrintFailures ? failures : customizedResults;

    const errorsPaddingLength = (
      _(filteredResults)
        .map(({ errors }) => (errors === null ? 0 : errors.length))
        .push('Errors'.length)
        .max()
    );
    const paddedErrorsHeading = _.padEnd('Errors', errorsPaddingLength, ' ');

    const tableHeading = `      ${reset('Run')} | ${paddedErrorsHeading} | Mock Data`;
    const tableHeadingLine = `      ${_.repeat('-', tableHeading.length)}`;
    const tableBodyRows = filteredResults.map(({ runIndex, errors, mockData }) => {
      const formattedRunIndex = reset(_.padStart(runIndex, 2, '0'));
      const formattedErrors = red(_.padEnd(errors, errorsPaddingLength, ' '));
      const formattedMockData = reset(JSON.stringify(mockData));

      return `       ${formattedRunIndex} | ${formattedErrors} | ${formattedMockData}`;
    });

    const message = [
      tableHeading,
      tableHeadingLine,
      tableBodyRows,
    ]
      .flat()
      .join('\n');

    console.log(message); // eslint-disable-line no-console

    if (!testPassed) {
      throw Error(`${failures.length}/${runCount} runs failed; see output above`);
    }
  };

  const saveResults = function () {
    const customizedResults = (
      _.range(runCount)
        .map((runIndex) => {
          let mockData;
          let errors = null;
          try {
            mockData = schemaToData(inputSchema);
          } catch (error) {
            errors = error.message;
          }

          return {
            runIndex,
            errors,
            mockData,
          };
        })
    );

    reportResults({
      customizedResults,
      onlyPrintFailures: !debug,
    });

    this.results = customizedResults.map((result) => _.pick(result, ['runIndex', 'mockData']));

    if (debug) {
      console.log('      ^^^^before^^^^\n'); // eslint-disable-line no-console
    }
  };

  const itReturnsValidData = () => {
    it('returns valid data', function () {
      const customizedResults = this.results.map((result) => {
        const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;
        const isValid = validator.validate(inputSchema, result.mockData);

        return {
          ...result,
          errors: isValid ? null : validator.errorsText(),
        };
      });

      reportResults({ customizedResults });
    });
  };

  let contextMethod = only ? context.only : context;
  contextMethod = skip ? context.skip : contextMethod;

  const formattedDescription = debug ? blue(scenario) : scenario;
  contextMethod(formattedDescription, function () {
    before(function () {
      if (!inputSchema) {
        throw Error('"schema" must be provided');
      }

      if (!_.isEmpty(unsupportedOptions)) {
        throw Error(`"testSchema" was called with unsupported options: ${_.keys(unsupportedOptions)}`);
      }

      if (ignoreSchemaValidation) {
        const isSchemaValid = regularValidator.validateSchema(inputSchema);

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

      if (debug) {
        const singleLineSchema = JSON.stringify(inputSchema, ' ');
        const stringifiedSchema = singleLineSchema.length < 60
          ? singleLineSchema
          : JSON.stringify(inputSchema, null, 2);

        const [firstLine, ...otherLines] = stringifiedSchema.split('\n');
        const formattedSchema = [
          firstLine,
          ...otherLines.map((line) => `      ${line}`),
        ].join('\n');
        console.log('      Schema:', formattedSchema); // eslint-disable-line no-console
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
