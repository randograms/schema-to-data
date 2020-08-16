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

const InputSchema = {
  type: ['boolean', 'object'],
  additionalProperties: true,
};

const ObjectInputSchema = {
  type: 'object',
  additionalProperties: true,
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

const ConformedArraySchema = {
  type: 'object',
  properties: {
    type: { const: 'array' },
    items: {
      type: 'array',
      items: { type: ['object'] },
    },
  },
  required: [
    'type',
    'items',
  ],
  additionalProperties: false,
};

const ConformedSchema = {
  type: 'object',
  required: ['type'],
  oneOf: [
    ConformedArraySchema,
    {
      properties: {
        type: { const: 'boolean' },
      },
      additionalProperties: false,
    },
    {
      properties: {
        type: { enum: ['decimal', 'integer'] },
        minimum: { type: 'number' },
        maximum: { type: 'number' },
      },
      required: [
        'minimum',
        'maximum',
      ],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: 'null' },
      },
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: 'object' },
        properties: { type: 'object' },
      },
      required: ['properties'],
      additionalProperties: false,
    },
    {
      properties: {
        type: { const: 'string' },
        minLength: { type: 'number' },
        maxLength: { type: 'number' },
      },
      required: [
        'minLength',
        'maxLength',
      ],
      additionalProperties: false,
    },
  ],
};

module.exports.libSchemas = {
  coerceSchema: {
    inputSchema: InputSchema,
  },
  coerceTypes: {
    inputSchema: ObjectInputSchema,
    outputSchema: TypedSchema,
  },
  conformSchemaToType: {
    inputSchema: SingleTypedSchema,
    outputSchema: ConformedSchema,
  },
  generateArray: {
    inputSchema: ConformedArraySchema,
    outputSchema: { type: 'array' },
  },
  selectType: {
    inputSchema: TypedSchema,
    outputSchema: SingleTypedSchema,
  },
};
