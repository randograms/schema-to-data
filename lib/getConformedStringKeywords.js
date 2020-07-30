module.exports.getConformedStringKeywords = function (singleTypedSchema) {
  const { DEFAULTS } = this;

  const minLength = singleTypedSchema.minLength || DEFAULTS.minStringLength;
  const maxLength = singleTypedSchema.maxLength || (minLength + DEFAULTS.stringLengthRange);

  return {
    minLength,
    maxLength,
  };
};
