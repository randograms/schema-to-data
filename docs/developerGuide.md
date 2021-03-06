# Developer Guide

## Diagrams

Diagrams are written with [PlantUml](https://plantuml.com/) and are located in the `uml/` directory

* [High Level Overview](https://raw.githubusercontent.com/randograms/schema-to-data/readme-assets/build/highLevelOverview.png)
* [Algorithm Functions (High Level)](https://raw.githubusercontent.com/randograms/schema-to-data/readme-assets/build/algorithmFunctionsHighLevel.png)
* [Algorithm Functions (Detailed)](https://raw.githubusercontent.com/randograms/schema-to-data/readme-assets/build/algorithmFunctionsDetailed.png)

Building diagrams locally:

```shell
npm run build:diagrams
```

or

```shell
npm run build:diagrams:watch
```

## The Mocker Class

All of the algorithm functions can be found in the `lib/` directory. These functions are added to the prototype of the Mocker class defined under `lib/mocker.js`. A Mocker instance encapsulates a set of user-configurable defaults that will be used in the algorithm. Mocker instances should never be exposed to the end user. The Mocker class itself has a function to extract the `schemaToData` function from a Mocker instance. This isolated `schemaToData` function will still be bound to the Mocker instance.

There is a `defaultMocker` singleton which contains the default defaults.

## index.js

The index file exposes two functions: `schemaToData` and `createWithDefaults`. `schemaToData` is bound to the `defaultMocker`. `createWithDefaults` returns a version of `schemaToData` that is bound to a new Mocker instance. This allows the end user to create multiple `schemaToData` functions with separate default values.

## Tests

The majority of tests will create a set of results and make assertions on the set vs a single result. Due to the random nature of the library some tests can be flaky.

### Unit Tests

Tests the granular responsibilites of the algorithm. Functions under test will usually take a pseudo-schema and return a coerced pseudo-schema. The majority of tests will use the `testUnit` helper function.

```shell
npm run test:unit
```

#### The testUnit Unit Helper

Unit tests mainly cover the functions found in the `lib/` directory which are attached to a Mocker instance. Instead of calling these functions directly in unit tests, use the `testUnit` function. This helper function will lookup the input and output schemas for a given library function. It will enforce that the test data passed into the function and the shape of the return data match the expected shape. [tests/libSchemas.js](../tests/libSchemas.js) contains all of the schemas that unit tests should be concerned with.

**Note:** There was an attempt to use Typescript to cover the purpose of the `testUnit` helper. However, Typescript cannot cover the same granular assertions that the `testUnit` framework provides and it required too much additional code with little value.

#### ReferenceSchema

Unit tests for functions that can take schemas with subschemas should not care about the shape of the subschemas. Use a ReferenceSchema with a `referenceId` to create a placeholder subschema for these tests. ReferenceSchema is defined in the aforementioned libSchemas file. Look at existing unit tests to see how ReferenceSchemas are used to assert that subschemas are coerced properly. The `referenceId` is simply there for debugging purposes.

### Integration Tests

Tests the *schemaToData* function as a whole. All tests use the `testSchema` integration helper which needs it's own documentation. Tests should focus on as few keywords as possible and assertion statements should be as limited in scope as possible.

```shell
npm run test:integration
```

Supported environment variables:

* DEBUG=true: Will always print generated data, even if a test passes. Produces verbose output, so it is recommended to isolate a single test case first.
* RUN_COUNT=n: Minimum run count. `testSchema` will use the maximum of RUN_COUNT and the test case's defined runCount. Since tests are inherently flaky it is recommended to set a high RUN_COUNT to separate flaky tests from broken tests during development. `n` is an integer.

#### The testSchema Integration Helper

**Note**: Documentation needed
