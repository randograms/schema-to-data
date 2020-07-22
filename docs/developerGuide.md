# Developer Guide

## The Flowchart

**Note**: The flowchart is currently out of date as it was created before the code

The flowchart explains the algorithm at a high level with pseudo code. There should be a correspondence between the flowchart and the actual implementation.

See the current flowchart [here](./flowchart.md)

Build the flowchart locally:

```shell
npm run build:flowchart
```

### Updating the Flowchart

The flowchart is written with [PlantUml](https://plantuml.com/). Build the flowchart in watch mode and then update `flowchart.puml`

```shell
npm run build:flowchart:watch
```

## Tests

The majority of tests will create a set of results and make assertions on the set vs a single result. Due to the random nature of the library some tests can be flaky.

### Unit Tests

Tests the granular responsibilites of the algorithm. Functions under test will usually take a pseudo-schema and return a coerced pseudo-schema.

```shell
npm run test:unit
```

### Integration Tests

Tests the *schemaToData* function as a whole. All tests use the `testSchema` integration helper which needs it's own documentation. Tests should focus on as few keywords as possible and assertion statements should be as limited in scope as possible.

```shell
npm run test:integration
```

#### testSchema Integration Helper

**Note**: Documentation needed
