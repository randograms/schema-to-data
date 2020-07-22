# schema-to-data

Straightforward (and soon to be well-documented) algorithm for generating mock data given a json-schema. *schema-to-data* exists to serve [schema-to-generator](https://www.npmjs.com/package/@randograms/schema-to-generator) which provides a much more flexible api for generating mock data. If you are just here to generate mock data then install [schema-to-generator](https://www.npmjs.com/package/@randograms/schema-to-generator) instead!

**Note**: This library has not been released to npm yet and is still under development

## Installation

```shell
npm install --save-dev https://github.com/randograms/schema-to-data
```

## Getting Started

```javascript
const { schemaToData } = require('schema-to-data');

// prints a string
console.log(schemaToData({ type: 'string' }));

// prints an object with at least 7 properties
console.log(schemaToData({
  type: 'object',
  minProperties: 7,
}));

// prints either an integer or decimal that is greater than or equal to 70 OR a string array with at least 2 items
console.log(schemaToData({
  type: ['number', 'array'],
  minimum: 70,
  items: { type: 'string' },
  minItems: 2,
}));
```

## Features

Github project [roadmap](https://github.com/randograms/schema-to-data/projects/1).

### Currently Supported Keywords

- All
  - type
- Array
  - maxItems
  - minItems
- Object
  - maxProperties
  - minProperties
  - properties
  - required
- String
  - maxLength
  - minLength
- Number
  - maximum
  - minimum

### Planned Supported Keywords

- All
  - $ref
  - const
  - allOf
  - anyOf
  - enum
  - examples
  - oneOf
- Array
  - additionalItems
  - contains
- Object
  - additionalProperties
  - patternProperties
  - propertyNames
- String
  - format
  - pattern
- Number
  - exclusiveMaximum (draft4 and draft6)
  - exclusiveMinimum (draft4 and draft6)
  - multipleOf

### Planned Features

- Configurable defaults for lengths, minimums, maximums etc.

### Unplanned Keywords

- All
  - not
- Array
  - uniqueItems
- Object
  - dependencies

## Project Scope

### Goals

- Provide a clear algorithm for generating mock data given a json-schema
  - Maintain separation of concerns via thorough unit tests
  - Provide documentation for the internals of the library at both a high level and a more granular level
  - Maintain high level integration tests
  - Maintain integration regression tests for found issues
- Provide clear expectations based on json-schema draft versions
  - Limit extraneous default functionality that is not stated in the json-schema specification
  - Be open to configurable quality of life enhancements
  - Separate supported behavior based on json-schema draft

### Out of Scope Concerns

- Schema validation
  - *schema-to-data* should ignore any malformed json-schema keywords and will ignore any custom json-schema keywords
  - *schema-to-data* will always attempt to generate valid data until it is forced to throw an exception
  - Consider using [Another JSON Schema Validator](https://ajv.js.org/) for schema validation as it is well-documented and thoroughly versed in the nuances of json-schema
  - *schema-to-data* officially uses [Another JSON Schema Validator](https://ajv.js.org/) for its tests
- Extreme edge cases
  - Validating data against a json-schema is much easier than generating data, therefore edge cases will only be handled if a solution can fit cleanly into the algorithm
  - Consider using [schema-to-generator](https://www.npmjs.com/package/@randograms/schema-to-generator) instead of *schema-to-data* as it provides more flexibility when working with complex schemas
- Seeded "random" data
  - *schema-to-data* does not provide a means to seed random data even if some of the underlying libraries provide such functionality
- Exposing internal dependencies
  - *schema-to-data* is not strictly tied to any underlying library for data generation and will not expose any underlying library

## More Docs

[Developer Guide](./docs/developerGuide)
