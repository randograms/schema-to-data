const _ = require('lodash');
const { lib } = require('../..');

const sandbox = sinon.createSandbox();

const generateValidTestSchema = ({ properties = {}, required = [] } = {}) => ({ properties, required });

describe('generateObject', function () {
  context('with a schema without property schemas', function () {
    it('returns an empty object', function () {
      const schema = generateValidTestSchema();
      expect(lib.generateObject(schema)).to.eql({});
    });
  });

  context('with a schema with optional properties', function () {
    this.retries(10);

    beforeEach(function () {
      this.propertySchema1 = Symbol('propertySchema1');
      this.propertySchema2 = Symbol('propertySchema2');

      this.generatedData1 = Symbol('generatedData1');
      this.generatedData2 = Symbol('generatedData2');

      const stub = sandbox.stub(lib, 'generateData');
      stub.withArgs(this.propertySchema1).returns(this.generatedData1);
      stub.withArgs(this.propertySchema2).returns(this.generatedData2);

      const schema = generateValidTestSchema({
        properties: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
        },
      });

      this.results = _.times(10, () => lib.generateObject(schema));
    });
    afterEach(sandbox.restore);

    it('sometimes returns an empty object', function () {
      expect(this.results).to.include.something.that.satisfies(_.isEmpty);
    });

    it('sometimes returns an object with just property1', function () {
      expect(this.results).to.include.something.that.eqls({ property1: this.generatedData1 });
    });

    it('sometimes returns an object with just property2', function () {
      expect(this.results).to.include.something.that.eqls({ property2: this.generatedData2 });
    });

    it('sometimes returns an object with all properties', function () {
      expect(this.results).to.include.something.that.eqls({
        property1: this.generatedData1,
        property2: this.generatedData2,
      });
    });
  });

  context('with a schema with required properties', function () {
    before(function () {
      this.propertySchema1 = Symbol('propertySchema1');
      this.propertySchema2 = Symbol('propertySchema2');

      this.generatedData1 = Symbol('generatedData1');
      this.generatedData2 = Symbol('generatedData2');

      const stub = sandbox.stub(lib, 'generateData');
      stub.withArgs(this.propertySchema1).returns(this.generatedData1);
      stub.withArgs(this.propertySchema2).returns(this.generatedData2);

      const schema = generateValidTestSchema({
        properties: {
          property1: this.propertySchema1,
          property2: this.propertySchema2,
        },
        required: [
          'property1',
          'property2',
        ],
      });

      this.results = _.times(10, () => lib.generateObject(schema));
    });
    after(sandbox.restore);

    it('always returns an object with the required properties', function () {
      expect(this.results).to.all.eql({
        property1: this.generatedData1,
        property2: this.generatedData2,
      });
    });
  });
});
