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

const isSchema = (keywordValue) => _.isBoolean(keywordValue) || (!_.isNull(keywordValue) && _.isObject(keywordValue));
const pickSchema = (schema1, schema2) => {
  if (schema1 === false || schema2 === false) {
    return false;
  }

  if (schema1 === true) {
    return schema2;
  }

  if (schema2 === true) {
    return schema1;
  }

  return { allOf: [schema1, schema2] };
};

const MERGE_RULES = {
  all: {
    const: {
      isKeywordValid: (keywordValue) => keywordValue !== undefined,
      pickByValue: (constA, constB) => constB, // assumes the values would be the same if they both exist
    },
    enum: {
      isKeywordValid: _.isArray,
      pickByValue: (enumA, enumB) => _.intersectionWith(enumA, enumB, _.isEqual),
    },
  },
  array: {
    additionalItems: {
      isKeywordValid: isSchema,
      pickByValue: pickSchema,
    },
    items: {
      isKeywordValid: (keywordValue) => (
        _.isArray(keywordValue) || isSchema(keywordValue)
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

              return pickSchema(subschema1, subschema2);
            }

            return subschema1;
          });
        }

        if (is1ATuple || is2ATuple) {
          const [itemsTuple, singleSubschema] = is1ATuple ? [items1, items2] : [items2, items1];

          if (singleSubschema === false) {
            return false;
          }

          return itemsTuple.map((tupleSubschema) => pickSchema(singleSubschema, tupleSubschema));
        }

        return pickSchema(items1, items2);
      },
    },
  },
  decimal: numberRules,
  integer: numberRules,
  object: {
    additionalProperties: {
      isKeywordValid: isSchema,
      pickByValue: pickSchema,
    },
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
              pickSchema(properties1[propertyName], properties2[propertyName]),
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
    format: {
      isKeywordValid: _.isString,
      pickByValue: (formatA, formatB) => formatB,
    },
    maxLength: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.min,
    },
    minLength: {
      isKeywordValid: _.isNumber,
      pickByValue: Math.max,
    },
    pattern: {
      isKeywordValid: _.isString,
      pickByValue: (formatA, formatB) => formatB,
    },
  },
};

const mergeKeywordsIntoSchema = (schemaA, schemaB, type) => {
  const relevantRules = {
    ...MERGE_RULES.all,
    ...MERGE_RULES[type],
  };

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
