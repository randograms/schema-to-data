const InputSchema = {
  type: ['boolean', 'object'],
  additionalProperties: true,
};

const ObjectInputSchema = {
  type: 'object',
  additionalProperties: true,
};

const IntermediateType = {
  enum: [
    'array',
    'boolean',
    'decimal',
    'integer',
    'null',
    'object',
    'string',
  ],
};

const NestedTypedSchema2 = {
  type: 'object',
  properties: {
    allOf: { type: 'null' },
    anyOf: { type: 'null' },
    oneOf: { type: 'null' },
    type: {
      type: 'array',
      items: IntermediateType,
      minItems: 1,
    },
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const NestedTypedSchema1 = {
  type: 'object',
  properties: {
    allOf: {
      type: ['null', 'array'],
      minItems: 1,
      items: NestedTypedSchema2,
    },
    anyOf: {
      type: ['null', 'array'],
      items: NestedTypedSchema2,
      minItems: 1,
    },
    oneOf: {
      type: ['null', 'array'],
      items: NestedTypedSchema2,
      minItems: 1,
    },
    type: {
      type: 'array',
      items: IntermediateType,
      minItems: 1,
    },
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const TypedSchema = {
  type: 'object',
  properties: {
    allOf: {
      type: ['null', 'array'],
      minItems: 1,
      items: NestedTypedSchema1,
    },
    anyOf: {
      type: ['null', 'array'],
      items: NestedTypedSchema1,
      minItems: 1,
    },
    oneOf: {
      type: ['null', 'array'],
      items: NestedTypedSchema1,
      minItems: 1,
    },
    type: {
      type: 'array',
      items: IntermediateType,
      minItems: 1,
    },
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const NestedSingleTypedSchema2 = {
  type: 'object',
  properties: {
    allOf: { type: 'null' },
    anyOf: { type: 'null' },
    oneOf: { type: 'null' },
    type: IntermediateType,
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const NestedSingleTypedSchema1 = {
  type: 'object',
  properties: {
    allOf: {
      type: ['null', 'array'],
      minItems: 1,
      items: NestedSingleTypedSchema2,
    },
    anyOf: {
      type: ['null', 'array'],
      items: NestedSingleTypedSchema2,
      minItems: 1,
    },
    oneOf: {
      type: ['null', 'array'],
      items: NestedSingleTypedSchema2,
      minItems: 1,
    },
    type: IntermediateType,
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const SingleTypedSchema = {
  type: 'object',
  properties: {
    allOf: {
      type: ['null', 'array'],
      minItems: 1,
      items: NestedSingleTypedSchema1,
    },
    anyOf: {
      type: ['null', 'array'],
      items: NestedSingleTypedSchema1,
      minItems: 1,
    },
    oneOf: {
      type: ['null', 'array'],
      items: NestedSingleTypedSchema1,
      minItems: 1,
    },
    type: IntermediateType,
  },
  required: [
    'allOf',
    'anyOf',
    'oneOf',
    'type',
  ],
  additionalProperties: true,
};

const MergedSchema = {
  type: 'object',
  properties: {
    allOf: false,
    anyOf: false,
    oneOf: false,
    type: IntermediateType,
  },
  required: ['type'],
  additionalProperties: true,
};

const ReferenceSchema = {
  type: 'object',
  properties: {
    referenceId: {
      type: 'string',
      minLength: 1,
    },
  },
  required: ['referenceId'],
  additionalProperties: false,
};

const PseudoArraySchema = {
  type: 'object',
  properties: {
    additionalItems: {
      oneOf: [
        ReferenceSchema,
        { const: false },
      ],
    },
    items: {
      type: 'array',
      items: ReferenceSchema,
    },
    maxItems: { type: 'number' },
    minItems: { type: 'number' },
  },
  required: [
    'additionalItems',
    'items',
    'maxItems',
    'minItems',
  ],
  additionalProperties: false,
};

const CoercedArrayItemsSchema = {
  type: 'array',
  items: ReferenceSchema,
};

const ConformedArraySchema = {
  type: 'object',
  properties: {
    items: {
      type: 'array',
      items: ReferenceSchema,
    },
    type: { const: 'array' },
  },
  required: [
    'items',
    'type',
  ],
  additionalProperties: false,
};

const ConformedBooleanSchema = {
  type: 'object',
  properties: {
    type: { const: 'boolean' },
  },
  required: [
    'type',
  ],
  additionalProperties: false,
};

const ConformedNumberKeywordsSchema = {
  type: 'object',
  properties: {
    maximum: { type: 'number' },
    minimum: { type: 'number' },
  },
  required: [
    'maximum',
    'minimum',
  ],
  additionalProperties: false,
};

const ConformedNullSchema = {
  type: 'object',
  properties: {
    type: { const: 'null' },
  },
  required: [
    'type',
  ],
  additionalProperties: false,
};

const ConformedNumberSchema = {
  type: 'object',
  properties: {
    maximum: { type: 'number' },
    minimum: { type: 'number' },
    type: { enum: ['decimal', 'integer'] },
  },
  required: [
    'maximum',
    'minimum',
    'type',
  ],
  additionalProperties: false,
};

const PseudoObjectSchema = {
  type: 'object',
  properties: {
    additionalPropertiesSchema: ReferenceSchema,
    maxProperties: {
      oneOf: [
        { type: 'number' },
        ReferenceSchema,
      ],
    },
    minProperties: {
      oneOf: [
        { type: 'number' },
        ReferenceSchema,
      ],
    },
    propertiesSchemas: {
      type: 'object',
      additionalProperties: {
        oneOf: [
          ReferenceSchema,
          { enum: [true, false] },
        ],
      },
    },
    propertyNamesToGenerate: {
      type: 'array',
      items: { type: 'string' },
    },
    shuffledOptionalPropertyNames: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: [
    'additionalPropertiesSchema',
    'maxProperties',
    'minProperties',
    'propertiesSchemas',
    'propertyNamesToGenerate',
    'shuffledOptionalPropertyNames',
  ],
  additionalProperties: false,
};

const CoercedObjectPropertiesSchema = {
  type: 'object',
  additionalProperties: ReferenceSchema,
};

const ConformedObjectSchema = {
  type: 'object',
  properties: {
    properties: {
      type: 'object',
      additionalProperties: ReferenceSchema,
    },
    type: { const: 'object' },
  },
  required: [
    'type',
    'properties',
  ],
  additionalProperties: false,
};

const ConformedStringKeywordsSchema = {
  type: 'object',
  properties: {
    format: {
      enum: [
        null,
        'date',
        'date-time',
        'email',
        'ipv4',
        'ipv6',
        'time',
        'uuid',
      ],
    },
    maxLength: { type: 'number' },
    minLength: { type: 'number' },
  },
  required: [
    'format',
    'maxLength',
    'minLength',
  ],
  additionalProperties: false,
};

const ConformedStringSchema = {
  type: 'object',
  properties: {
    ...ConformedStringKeywordsSchema.properties,
    type: { const: 'string' },
  },
  required: [
    ...ConformedStringKeywordsSchema.required,
    'type',
  ],
  additionalProperties: false,
};

const ConformedSchema = {
  type: 'object',
  required: ['type'],
  oneOf: [
    ConformedArraySchema,
    ConformedBooleanSchema,
    ConformedNullSchema,
    ConformedNumberSchema,
    ConformedObjectSchema,
    ConformedStringSchema,
  ],
};

module.exports.libSchemas = {
  coerceSchema: {
    inputSchema: InputSchema,
    outputSchema: ConformedSchema,
  },
  coerceTypes: {
    inputSchema: ObjectInputSchema,
    outputSchema: TypedSchema,
  },
  conformSchemaToType: {
    inputSchema: MergedSchema,
    outputSchema: ConformedSchema,
  },
  generateArray: {
    inputSchema: ConformedArraySchema,
    outputSchema: { type: 'array' },
  },
  generateBoolean: {
    inputSchema: ConformedBooleanSchema,
    outputSchema: { type: 'boolean' },
  },
  generateData: {
    inputSchema: ConformedSchema,
    outputSchema: true,
  },
  generateNumber: {
    inputSchema: ConformedNumberSchema,
    outputSchema: { type: 'number' },
  },
  generateString: {
    inputSchema: ConformedStringSchema,
    outputSchema: { type: 'string' },
  },
  generateObject: {
    inputSchema: ConformedObjectSchema,
    outputSchema: { type: 'object' },
  },

  // getConformedArrayKeywords
  createPseudoArraySchema: {
    inputSchema: MergedSchema,
    outputSchema: PseudoArraySchema,
  },
  getCoercedItemsSchemas: {
    inputSchema: PseudoArraySchema,
    outputSchema: CoercedArrayItemsSchema,
  },

  getConformedNumberKeywords: {
    inputSchema: MergedSchema,
    outputSchema: ConformedNumberKeywordsSchema,
  },

  // getConformedObjectKeywords
  createPseudoObjectSchema: {
    inputSchema: MergedSchema,
    outputSchema: PseudoObjectSchema,
  },
  fillOutPropertiesToGenerate: {
    inputSchema: PseudoObjectSchema,
    outputSchema: PseudoObjectSchema,
  },
  guaranteeRequiredPropertiesHaveSchemas: {
    inputSchema: PseudoObjectSchema,
    outputSchema: PseudoObjectSchema,
  },
  getCoercedPropertiesSchemas: {
    inputSchema: PseudoObjectSchema,
    outputSchema: CoercedObjectPropertiesSchema,
  },

  getConformedStringKeywords: {
    inputSchema: MergedSchema,
    outputSchema: ConformedStringKeywordsSchema,
  },
  mergeCombinedSchemas: {
    inputSchema: SingleTypedSchema,
    outputSchema: MergedSchema,
  },
  selectType: {
    inputSchema: TypedSchema,
    outputSchema: SingleTypedSchema,
  },
};
