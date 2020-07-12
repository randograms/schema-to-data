const _ = require('lodash');
const Ajv = require('ajv');
const {
  blue,
  reset,
  red,
  yellow,
} = require('ansi-colors');
const { schemaToData } = require('../../..');

const regularValidator = new Ajv();
const edgeCaseValidator = new Ajv({ validateSchema: false });

const testSchema = ({
  scenario,
  schema: inputSchema,
  runCount = 10,
  theSchemaIsInvalidBecause: expectedSchemaValidationError = null,
  itValidatesAgainst: validationSchemas = null,
  debug = process.env.DEBUG === 'true',
  only = false,
  skip = false,
  ...unsupportedOptions
} = {}) => {
  const hasScenario = scenario !== undefined;

  const hasInputSchema = inputSchema !== undefined;
  const expectedError = hasInputSchema ? inputSchema.itThrowsTheError || null : null;
  const returnDescriptor = hasInputSchema ? inputSchema.itAlwaysReturns || null : null;
  const isValidationTest = returnDescriptor !== null && expectedError === null;
  const isErrorTest = returnDescriptor === null && expectedError !== null;
  const hasBaseTestAnnotation = isValidationTest || isErrorTest;

  const ignoreSchemaValidation = expectedSchemaValidationError !== null;

  const hasValidationSchemas = validationSchemas !== null;
  const isValidationSchemasValid = hasValidationSchemas && _.isArray(validationSchemas) && validationSchemas.length > 0;
  const areAllValidationSchemasAnnotated = isValidationSchemasValid && validationSchemas.every((schema) => {
    const hasAlwaysAnnotation = _.isString(schema.itAlwaysReturns);
    const hasSometimesAnnotation = _.isString(schema.itSometimesReturns);

    return (hasAlwaysAnnotation && !hasSometimesAnnotation) || (!hasAlwaysAnnotation && hasSometimesAnnotation);
  });

  const wasOnlyCalledWithSupportedOptions = _.isEmpty(unsupportedOptions);

  const reportInvalidTestSetup = () => {
    if (!hasScenario) {
      throw Error('"testSchema" must be provided a "scenario"');
    }

    if (!hasInputSchema) {
      throw Error('"testSchema" must be provided a "schema"');
    }

    if (!hasBaseTestAnnotation) {
      throw Error('"schema" must have either of the string annotations "itAlwaysReturns" or "itThrowsTheError"');
    }

    if (ignoreSchemaValidation) {
      const isSchemaValid = regularValidator.validateSchema(inputSchema);

      if (isSchemaValid) {
        throw Error('Expected "schema" to not be a valid json-schema');
      }

      expect(
        regularValidator.errorsText(),
        'Schema failed validation for the wrong reason',
      ).to.include(expectedSchemaValidationError);
    }

    if (hasValidationSchemas) {
      if (!isValidationSchemasValid) {
        throw Error('"itValidatesAgainst" must be a non empty array');
      }

      if (!areAllValidationSchemasAnnotated) {
        throw Error('All schemas in "itValidatesAgainst" must have an "itAlwaysReturns" or "itSometimesReturns" string annotation'); // eslint-disable-line max-len
      }
    }

    if (!wasOnlyCalledWithSupportedOptions) {
      throw Error(`"testSchema" was called with unsupported option(s): ${_.keys(unsupportedOptions)}`);
    }
  };

  const itThrowsTheExpectedError = () => {
    it(`throws "${expectedError}"`, function () {
      const testSchemaToData = () => schemaToData(inputSchema);
      expect(testSchemaToData).to.throw(expectedError);
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
    it(`always returns ${returnDescriptor}`, function () {
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

  let formattedDescription = scenario || '**Missing scenario description**';
  formattedDescription = debug ? blue(formattedDescription) : formattedDescription;
  contextMethod(formattedDescription, function () {
    before(reportInvalidTestSetup);
    before(function () {
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
        throw Error(yellow('"testSchema" was run with "only"'));
      }
    });

    if (!hasBaseTestAnnotation) {
      it('**Missing base test annotation**', _.noop);
      return;
    }

    if (isErrorTest) {
      itThrowsTheExpectedError();
      return;
    }

    before(saveResults);
    itAlwaysReturnsValidData();

    if (areAllValidationSchemasAnnotated) {
      validationSchemas.forEach((schema) => {
        const willAlwaysValidate = schema.itAlwaysReturns !== undefined;

        if (willAlwaysValidate) itAlwaysValidatesAgainstTheSchema(schema);
        else itSometimesValidatesAgainstTheSchema(schema);
      });
    }
  });
};

testSchema.only = (options) => testSchema({ ...options, only: true });
testSchema.skip = (options) => testSchema({ ...options, skip: true });

module.exports = { testSchema };
