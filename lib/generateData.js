module.exports.generateData = function (singleTypedSchema) {
  switch (singleTypedSchema.type) {
    case 'array': return this.generateArray(singleTypedSchema);
    case 'boolean': return this.generateBoolean();
    case 'decimal': return this.generateNumber(singleTypedSchema);
    case 'integer': return this.generateNumber(singleTypedSchema);
    case 'null': return null;
    case 'object': return this.generateObject(singleTypedSchema);
    case 'string': return this.generateString(singleTypedSchema);
    default: throw Error(`Expected schema to have a known type but got "${singleTypedSchema.type}"`);
  }
};
