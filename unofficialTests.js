const _ = require('lodash');
const { red } = require('ansi-colors');
const schemaToData = require('.');

[
  ['empty type array', { type: [] }],
  ['null', { type: 'null' }],
  ['string', { type: 'string' }],
  ['number', { type: 'number' }],
  ['integer', { type: 'integer' }],
  ['boolean', { type: 'boolean' }],
  ['array', { type: 'array' }],
  ['object', { type: 'object' }],
  ['1 type', { type: ['string'] }],
  ['2 types', { type: ['null', 'string'] }],
  ['all types', { type: ['null', 'string', 'number', 'integer', 'boolean', 'array', 'object'] }],
  ['all types*', { type: false }],
  ['tuple array', { type: 'array', items: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }] }],
  ['list array', { type: 'array', items: {} }],
  ['string array', { type: 'array', items: { type: 'string' } }],
  ['2 type array', { type: 'array', items: { type: ['string', 'boolean'] } }],
  ['optional properties', {
    type: 'object',
    properties: {
      optional1: { type: 'string' },
      optional2: { type: 'number' },
    },
  }],
  ['required properties', {
    type: 'object',
    properties: {
      required1: { type: 'string' },
      optional1: { type: 'number' },
    },
    required: ['required1'],
  }],
].forEach(([label, schema]) => {
  const paddedLabel = `${_.padEnd(label, 17, ' ')}:`;
  try {
    console.log(paddedLabel, schemaToData(schema));
  } catch (error) {
    console.log(paddedLabel, red(error.message));
  }
})
