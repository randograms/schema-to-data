const _ = require('lodash');
const Ajv = require('ajv');
const { libSchemas } = require('./libSchemas');

const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

ajv.addKeyword('type', {
  validate: (schema, data) => {
    switch (schema.type) {
      case 'null': return data === null;
      case 'array': return Array.isArray(data);
      default: return typeof data === schema.type; // eslint-disable-line valid-typeof
    }
  },
  errors: false,
});

global.testUnit = (mocker, functionName, input) => {
  const schemas = libSchemas[functionName];
  if (!schemas) {
    throw Error(`No lib schemas defined for "${functionName}"`);
  }
  const { inputSchema, outputSchema } = schemas;

  const isInputValid = ajv.validate(inputSchema, input);
  if (!isInputValid) {
    throw Error(`Invalid input to "${functionName}":\n ${ajv.errorsText().split(',').join('\n')}`);
  }

  const output = mocker[functionName](input);
  const isOutputValid = ajv.validate(outputSchema, output);
  if (!isOutputValid) {
    throw Error(`Invalid output from "${functionName}"\n ${ajv.errorsText().split(',').join('\n')}`);
  }

  return output;
};
