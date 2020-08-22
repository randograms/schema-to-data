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

module.exports.libSchemas = {
  coerceSchema: {
    inputSchema: InputSchema,
  },
  coerceTypes: {
    inputSchema: ObjectInputSchema,
    outputSchema: TypedSchema,
  },
  selectType: {
    inputSchema: TypedSchema,
    outputSchema: SingleTypedSchema,
  },
};
