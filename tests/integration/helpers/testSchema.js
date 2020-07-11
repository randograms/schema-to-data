const _ = require('lodash');
const Ajv = require('ajv');
const { blue, reset, red } = require('ansi-colors');
const { schemaToData } = require('../../..');

const regularValidator = new Ajv();
const edgeCaseValidator = new Ajv({ validateSchema: false });

const testSchema = ({
  scenario,
  schema: inputSchema,
  runCount = 10,
  itAlwaysValidatesAgainst: schemasThatAlwaysValidate = null,
  itSometimesValidatesAgainst: schemasThatValidateAtLeastOnce = null,
  theSchemaIsInvalidBecause: expectedSchemaValidationError = null,
  itThrowsTheError: expectedError = null,
  debug = process.env.DEBUG === 'true',
  only = false,
  skip = false,
  ...unsupportedOptions
} = {}) => {
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
    allMustPass,
    onlyPrintFailures = true,
  } = {}) => {
    const failures = customizedResults.filter(({ errors }) => errors !== null);
    const testPassed = allMustPass ? failures.length === 0 : failures.length !== customizedResults.length;

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

  const getSchemaValidationResults = (results, validator, schema) => results.map((result) => ({
    ...result,
    errors: validator.validate(schema, result.mockData) ? null : validator.errorsText(),
  }));

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
      allMustPass: true,
      onlyPrintFailures: !debug,
    });

    this.results = customizedResults.map((result) => _.pick(result, ['runIndex', 'mockData']));

    if (debug) {
      console.log('      ^^^^before^^^^\n'); // eslint-disable-line no-console
    }
  };

  const itAlwaysReturnsValidData = () => {
    it('always returns valid data', function () {
      const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;

      reportResults({
        customizedResults: getSchemaValidationResults(this.results, validator, inputSchema),
        allMustPass: true,
      });
    });
  };

  const itAlwaysValidatesAgainstTheSchema = (validationSchema) => {
    const statement = validationSchema.itAlwaysReturns;
    it(`always returns ${statement}`, function () {
      reportResults({
        customizedResults: getSchemaValidationResults(this.results, regularValidator, validationSchema),
        allMustPass: true,
      });
    });
  };

  const itSometimesValidatesAgainstTheSchema = (validationSchema) => {
    const statement = validationSchema.itSometimesReturns;
    it(`sometimes returns ${statement}`, function () {
      reportResults({
        customizedResults: getSchemaValidationResults(this.results, regularValidator, validationSchema),
        allMustPass: false,
      });
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

      if (schemasThatValidateAtLeastOnce !== null) {
        if (!_.isArray(schemasThatValidateAtLeastOnce) || schemasThatValidateAtLeastOnce.length === 0) {
          throw Error('"itSometimesValidatesAgainst" must be a non empty array');
        }

        const allSchemasAreAnnotated = (
          _(schemasThatValidateAtLeastOnce)
            .map('itSometimesReturns')
            .every(_.isString)
            .valueOf()
        );
        if (!allSchemasAreAnnotated) {
          throw Error('All schemas in "itSometimesValidatesAgainst" must have an "itSometimesReturns" string annotation'); // eslint-disable-line max-len
        }
      }

      if (schemasThatAlwaysValidate !== null) {
        if (!_.isArray(schemasThatAlwaysValidate) || schemasThatAlwaysValidate.length === 0) {
          throw Error('"itAlwaysValidatesAgainst" must be a non empty array');
        }

        const allSchemasAreAnnotated = (
          _(schemasThatAlwaysValidate)
            .map('itAlwaysReturns')
            .every(_.isString)
            .valueOf()
        );
        if (!allSchemasAreAnnotated) {
          throw Error('All schemas in "itAlwaysValidatesAgainst" must have an "itAlwaysReturns" string annotation'); // eslint-disable-line max-len
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
    itAlwaysReturnsValidData();

    if (schemasThatValidateAtLeastOnce !== null) {
      schemasThatValidateAtLeastOnce.forEach(itSometimesValidatesAgainstTheSchema);
    }

    if (schemasThatAlwaysValidate !== null) {
      schemasThatAlwaysValidate.forEach(itAlwaysValidatesAgainstTheSchema);
    }
  });
};

testSchema.only = (options) => testSchema({ ...options, only: true });
testSchema.skip = (options) => testSchema({ ...options, skip: true });

module.exports = { testSchema };
