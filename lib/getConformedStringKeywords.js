module.exports.getConformedStringKeywords = function (singleTypedSchema) {
  const minLength = singleTypedSchema.minLength || this.defaultMinStringLength;
  const maxLength = singleTypedSchema.maxLength || (minLength + this.defaultStringLengthRange);

  return {
    minLength,
    maxLength,
  };
};
