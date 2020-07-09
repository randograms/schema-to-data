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

  const saveResults = function () {
    this.results = _.range(runCount)
      .map((runIndex) => {
        let mockData;
        let errors = null;
        try {
          mockData = schemaToData(inputSchema);
          const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;

          if (!validator.validate(inputSchema, mockData)) errors = validator.errorsText();
        } catch (error) {
          errors = error.message;
        }

        return {
          runIndex,
          errors,
          mockData,
        };
      });

    this.failures = this.results.filter(({ errors }) => errors !== null);
    this.isSuccess = this.failures.length === 0;

    if (!debug && this.isSuccess) {
      return;
    }

    const filteredResults = debug
      ? this.results
      : this.failures;

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
  };

  const itReturnsValidData = () => {
    it('returns valid data', function () {
      if (!this.isSuccess) throw Error(`${this.failures.length}/${runCount} runs failed; see output above`);
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
