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

const TypedSchema = {
  type: 'object',
  properties: {
    type: {
      type: 'array',
      minItems: 1,
      items: IntermediateType,
    },
  },
  required: ['type'],
  additionalProperties: true,
};

const SingleTypedSchema = {
  type: 'object',
  properties: {
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

const ConformedStringKeywordsSchema = {
  type: 'object',
  properties: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' },
  },
  required: [
    'maxLength',
    'minLength',
  ],
  additionalProperties: false,
};

const ConformedStringSchema = {
  type: 'object',
  properties: {
    maxLength: { type: 'number' },
    minLength: { type: 'number' },
    type: { const: 'string' },
  },
  required: [
    'maxLength',
    'minLength',
    'type',
  ],
  additionalProperties: false,
};

module.exports.libSchemas = {
  coerceSchema: {
    inputSchema: InputSchema,
  },
  coerceTypes: {
    inputSchema: ObjectInputSchema,
    outputSchema: TypedSchema,
  },
  generateBoolean: {
    inputSchema: ConformedBooleanSchema,
    outputSchema: { type: 'boolean' },
  },
  generateNumber: {
    inputSchema: ConformedNumberSchema,
    outputSchema: { type: 'number' },
  },
  generateString: {
    inputSchema: ConformedStringSchema,
    outputSchema: { type: 'string' },
  },

  // getConformedArrayKeywords
  createPseudoArraySchema: {
    inputSchema: SingleTypedSchema,
    outputSchema: PseudoArraySchema,
  },
  getCoercedItemsSchemas: {
    inputSchema: PseudoArraySchema,
    outputSchema: CoercedArrayItemsSchema,
  },

  getConformedNumberKeywords: {
    inputSchema: SingleTypedSchema,
    outputSchema: ConformedNumberKeywordsSchema,
  },

  // getConformedObjectKeywords
  createPseudoObjectSchema: {
    inputSchema: SingleTypedSchema,
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
    inputSchema: SingleTypedSchema,
    outputSchema: ConformedStringKeywordsSchema,
  },
  selectType: {
    inputSchema: TypedSchema,
    outputSchema: SingleTypedSchema,
  },
};
