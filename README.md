# schema-to-data

Straightforward algorithm for generating mock data given a json-schema. *schema-to-data* exists to serve [schema-to-generator](https://www.npmjs.com/package/@randograms/schema-to-generator) which provides a much more flexible api for generating mock data. If you are just here to generate mock data then install [schema-to-generator](https://www.npmjs.com/package/@randograms/schema-to-generator) instead!

**Note**: This library has not been released to npm yet and is still under development

## Installation

```shell
npm install --save-dev https://github.com/randograms/schema-to-data
```

## Getting Started

```javascript
const {
  schemaToData,
  createWithDefaults, // see "Working with Custom Defaults" below
} = require('schema-to-data');

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
  - allOf
  - anyOf
  - oneOf
  - type
- Array
  - items
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
  - const
  - enum
  - examples
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

### Unplanned Keywords

- All
  - $ref
  - not
- Array
  - uniqueItems
- Object
  - dependencies

### Custom Defaults

#### Creating a Custom schemaToData Instance

```javascript
const { createWithDefaults } = require('schema-to-data');

const customSchemaToData = createWithDefaults({
  minStringLength: 50,
});

// prints a string with at least 50 characters
console.log(customSchemaToData({ type: 'string' }));
```

#### Inspecting Instance Defaults

```javascript
const {
  schemaToData,
  createWithDefaults,
} = require('schema-to-data');

const customSchemaToData = createWithDefaults({
  stringLengthRange: 1000,
});

// prints default defaults
console.log(schemaToData.getDefaults());

// prints instance defaults
console.log(customSchemaToData.getDefaults());
```

#### Available createWithDefaults Options

Schema keywords always take precedence over configurable defaults (ex: if a schema has "minLength", then "minLength" will be used instead of "minStringLength").

| Schemas | Option | Type | Default | Description |
| --- | --- | --- | --- | --- |
| array | minArrayItems | integer | 0 | Minimum number of array items to generate |
| array (tuple) | maxExtraAdditionalItems | integer | 10 | For tuple arrays without a "maxItems" definition, it is the maximum number of additional items that can be generated on top of "minItems", "minArrayItems", or the total number of items defined in the "items" keyword. |
| array (list) | arrayItemsRange | integer | 20 | Generated list arrays will have length between one of the following inclusive ranges: <ul><li>`[minArrayItems, minArrayItems + arrayItemsRange]`</li><li>`[minItems, minItems + arrayItemsRange]`</li><li>`[minArrayItems, maxItems]`</li><li>`[minItems, maxItems]`</li></ul> |
| number, integer | maxNumber | number | 1000000000 | Maximum number or integer to generate
| number, integer | minNumber | number | -1000000000 | Minimum number or integer to generate
| object | maxExtraAdditionalProperties | integer | 10 | When "maxProperties" is not defined, it is the maximum number of extra additional properties that can be generated on top of "minProperties", "minObjectProperties" or the toal number of required and optional properties. It is not necessarily the maximum number of additional properties that will be generated. |
| object | minObjectProperties | integer | 0 | Minimum number of object properties to generate |
| object | optionalPropertyPrioritization | number [0, 1] | 0.8 | When generating random object properties this is the chance that an optional property will be generated instead of an additional property. If set to 1, then no additional properties will be generated unless all optional properties are generated first. |
| string | minStringLength | integer | 0 | Minimum potential string length |
| string | stringLengthRange | integer | 500 | Generated strings will have length between one of the following inclusive ranges: <ul><li>`[minStringLength, minStringLength + stringLengthRange]`</li><li>`[minLength, minLength + stringLengthRange]`</li><li>`[minStringLength, maxLength]`</li><li>`[minLength, maxLength]`</li></ul> |

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

[Developer Guide](./docs/developerGuide.md)
