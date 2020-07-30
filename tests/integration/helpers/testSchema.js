const _ = require('lodash');
const Ajv = require('ajv');
const {
  blue,
  reset,
  red,
  yellow,
} = require('ansi-colors');
const {
  schemaToData: defaultSchemaToData,
  createWithDefaults,
} = require('../../..');

const regularValidator = new Ajv();
const edgeCaseValidator = new Ajv({ validateSchema: false });

const minDefaultRunCount = 30;
const defaultRunCount = parseInt(process.env.RUN_COUNT || minDefaultRunCount, 10);

const testSchema = ({
  scenario,
  customDefaults,
  schema: normalSchemaConfig,
  testBooleanLiteral: booleanSchemaConfig,
  runCount = defaultRunCount,
  theSchemaIsInvalidBecause: expectedSchemaValidationError = null,
  alternateBaseValidationSchema = null, // use if the edgeCaseValidator still throws an error
  itValidatesAgainst: validationSchemas = null,
  debug = process.env.DEBUG === 'true',
  only = false,
  skip = false,
  ...unsupportedOptions
} = {}) => {
  const schemaToData = customDefaults === undefined ? defaultSchemaToData : createWithDefaults(customDefaults);

  const hasInvalidRunCount = runCount < minDefaultRunCount;
  const actualRunCount = _.max([runCount, defaultRunCount]);

  const hasScenario = scenario !== undefined;

  const isNormalTest = normalSchemaConfig !== undefined;
  const isBooleanSchemaTest = booleanSchemaConfig !== undefined;
  const hasOneTestConfig = (isNormalTest && !isBooleanSchemaTest) || (!isNormalTest && isBooleanSchemaTest);

  let testConfig = null;
  let schemaToTest = null;
  if (hasOneTestConfig) {
    testConfig = isNormalTest ? normalSchemaConfig : booleanSchemaConfig;
    schemaToTest = isNormalTest ? normalSchemaConfig : booleanSchemaConfig.schema;
  }

  const expectedError = hasOneTestConfig ? testConfig.itThrowsTheError || null : null;
  const returnDescriptor = hasOneTestConfig ? testConfig.itAlwaysReturns || null : null;
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

    if (!hasOneTestConfig) {
      throw Error('"testSchema" must be provided either "schema" or "testBooleanLiteral"');
    }

    if (isNormalTest && !hasBaseTestAnnotation) {
      throw Error('"schema" must have either of the string annotations "itAlwaysReturns" or "itThrowsTheError"');
    }

    if (isBooleanSchemaTest && schemaToTest !== true && schemaToTest !== false) {
      throw Error('"testBooleanLiteral" must have boolean property "schema"');
    }

    if (isBooleanSchemaTest && !hasBaseTestAnnotation) {
      // eslint-disable-next-line max-len
      throw Error('"testBooleanLiteral" must have either of the string annotations "itAlwaysReturns" or "itThrowsTheError"');
    }

    if (ignoreSchemaValidation) {
      const isSchemaValid = regularValidator.validateSchema(schemaToTest);

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

    if (hasInvalidRunCount) {
      throw Error(`"runCount" must be greater than "minDefaultRunCount" ${minDefaultRunCount}`);
    }

    if (!wasOnlyCalledWithSupportedOptions) {
      throw Error(`"testSchema" was called with unsupported option(s): ${_.keys(unsupportedOptions)}`);
    }
  };

  const itThrowsTheExpectedError = () => {
    it(`throws "${expectedError}"`, function () {
      const testSchemaToData = () => {
        const mockData = schemaToData(schemaToTest);

        if (debug) {
          console.log('    Expected error, but got data:', JSON.stringify(mockData, null)); // eslint-disable-line no-console
        }
      };
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
      throw Error(`${failures.length}/${actualRunCount} runs failed; see output above`);
    }
  };

  const getSchemaValidationResults = (results, validator, schema) => results.map((result) => ({
    ...result,
    errors: validator.validate(schema, result.mockData) ? null : validator.errorsText(),
  }));

  const saveResults = function () {
    const customizedResults = (
      _.range(actualRunCount)
        .map((runIndex) => {
          let mockData;
          let errors = null;
          try {
            mockData = schemaToData(schemaToTest);
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
      const schema = alternateBaseValidationSchema === null ? schemaToTest : alternateBaseValidationSchema;
      const validator = ignoreSchemaValidation ? edgeCaseValidator : regularValidator;

      reportResults({
        customizedResults: getSchemaValidationResults(this.results, validator, schema),
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
        const singleLineSchema = JSON.stringify(schemaToTest, ' ');
        const stringifiedSchema = singleLineSchema.length < 60
          ? singleLineSchema
          : JSON.stringify(schemaToTest, null, 2);

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
