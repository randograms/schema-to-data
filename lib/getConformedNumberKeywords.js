module.exports.getConformedNumberKeywords = function (singleTypedSchema) {
  const { type } = singleTypedSchema;
  let {
    minimum,
    maximum,
  } = singleTypedSchema;

  if (minimum === undefined && maximum === undefined) {
    minimum = this.defaultMinNumber;
    maximum = this.defaultMaxNumber;
  } else if (minimum !== undefined && maximum === undefined) {
    maximum = (minimum + this.numberRange);
  } else if (minimum === undefined && maximum !== undefined) {
    minimum = maximum - this.numberRange;
  }

  if (type === 'integer') {
    minimum = Math.ceil(minimum);
    maximum = Math.floor(maximum);
  }

  return {
    minimum,
    maximum,
  };
};
