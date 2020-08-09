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
