const _ = require('lodash');

const numberRules = {
  maximum: {
    isKeywordValid: _.isNumber,
    pickByValue: Math.min,
  },
  minimum: {
    isKeywordValid: _.isNumber,
    pickByValue: Math.max,
  },
};

const MERGE_RULES = {
  array: {
    items: {
      isKeywordValid: (keywordValue) => (
        _.isArray(keywordValue) || (_.isObject(keywordValue) && !_.isNull(keywordValue))
      ),
      pickByValue: (items1, items2) => {
        const is1ATuple = _.isArray(items1);
        const is2ATuple = _.isArray(items2);

        if (is1ATuple && is2ATuple) {
          const [longestArray, otherArray] = items1.length > items2.length
            ? [items1, items2]
            : [items2, items1];

          return longestArray.map((subschema1, index) => {
            if (index < otherArray.length) {
              const subschema2 = otherArray[index];

              return { allOf: [subschema1, subschema2] };
            }

            return subschema1;
          });
        }

        if (is1ATuple || is2ATuple) {
          const [itemsTuple, singleSubschema] = is1ATuple ? [items1, items2] : [items2, items1];

          return itemsTuple.map((tupleSubschema) => ({
            allOf: [singleSubschema, tupleSubschema],
          }));
        }

        return { allOf: [items1, items2] };
      },
    },
  },
  decimal: numberRules,
  integer: numberRules,
  object: {
    maxProperties: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.min,
    },
    minProperties: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.max,
    },
    properties: {
      isKeywordValid: (keywordValue) => _.isObject(keywordValue) && !_.isArray(keywordValue) && !_.isNull(keywordValue),
      pickByValue: (properties1, properties2) => {
        const sharedPropertyNames = _.intersection(_.keys(properties1), _.keys(properties2));
        const combinedSharedProperties = (
          _(sharedPropertyNames)
            .map((propertyName) => [
              propertyName,
              { allOf: [properties1[propertyName], properties2[propertyName]] },
            ])
            .fromPairs()
            .value()
        );

        return {
          ...properties1,
          ...properties2,
          ...combinedSharedProperties,
        };
      },
    },
    required: {
      isKeywordValid: _.isArray,
      pickByValue: _.union,
    },
  },
  string: {
    maxLength: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.min,
    },
    minLength: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.max,
    },
  },
};

const mergeKeywordsIntoSchema = (schemaA, schemaB, type) => {
  const relevantRules = MERGE_RULES[type];

  _.forEach(relevantRules, (rule, keyword) => {
    const aHasKeyword = rule.isKeywordValid(schemaA[keyword]);
    const bHasKeyword = rule.isKeywordValid(schemaB[keyword]);

    if (bHasKeyword) {
      // eslint-disable-next-line no-param-reassign
      schemaA[keyword] = aHasKeyword
        ? rule.pickByValue(schemaA[keyword], schemaB[keyword])
        : schemaB[keyword];
    }
  });
};

const mergeCombinedSchemas = function (singleTypedSchema) {
  const mergedSchema = _.omit(singleTypedSchema, [
    'allOf',
    'anyOf',
    'oneOf',
  ]);

  const {
    allOf,
    anyOf,
    oneOf,
  } = singleTypedSchema;

  if (allOf !== null) {
    allOf
      .map((subschema) => this.mergeCombinedSchemas(subschema))
      .forEach((mergedSubschema) => {
        this.mergeKeywordsIntoSchema(mergedSchema, mergedSubschema, singleTypedSchema.type);
      });
  }

  if (anyOf !== null) {
    _(anyOf)
      .shuffle()
      .filter((subschema, index) => index === 0 || Math.random() < 0.5)
      .map((subschema) => this.mergeCombinedSchemas(subschema))
      .forEach((mergedSubschema) => {
        this.mergeKeywordsIntoSchema(mergedSchema, mergedSubschema, singleTypedSchema.type);
      });
  }

  if (oneOf !== null) {
    const randomSubschema = _.sample(oneOf);
    const mergedSubschema = this.mergeCombinedSchemas(randomSubschema);
    this.mergeKeywordsIntoSchema(mergedSchema, mergedSubschema, singleTypedSchema.type);
  }

  return mergedSchema;
};

module.exports = {
  mergeKeywordsIntoSchema,
  mergeCombinedSchemas,
};
