const _ = require('lodash');

module.exports.selectType = (typedSchema) => {
  const type = _.sample(typedSchema.type);

  const singleTypedSchema = {
    ...typedSchema,
    type,
  };

  return singleTypedSchema;
};
