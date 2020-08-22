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
  selectType: {
    inputSchema: TypedSchema,
    outputSchema: SingleTypedSchema,
  },
};
