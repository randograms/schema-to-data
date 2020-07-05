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
].forEach(([label, schema]) => {
  const paddedLabel = `${_.padEnd(label, 17, ' ')}:`;
  try {
    console.log(paddedLabel, schemaToData(schema));
  } catch (error) {
    console.log(paddedLabel, red(error.message));
  }
})
