const { lib } = require('../..');

const sandbox = sinon.createSandbox();

describe('generateData', function () {
  context('with a null schema', function () {
    it('returns null', function () {
      expect(lib.generateData({ type: 'null' })).to.be.null;
    });
  });

  context('with a string schema', function () {
    before(function () {
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateString').returns(this.data);

      this.result = lib.generateData({ type: 'string' });
    });
    after(sandbox.restore);

    it('calls generateString', function () {
      expect(lib.generateString).to.be.calledWithExactly();
    });

    it('returns the generated string', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with a number schema', function () {
    before(function () {
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateNumber').returns(this.data);

      this.result = lib.generateData({ type: 'number' });
    });
    after(sandbox.restore);

    it('calls generateNumber', function () {
      expect(lib.generateNumber).to.be.calledWithExactly();
    });

    it('returns the generated number', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with an integer schema', function () {
    before(function () {
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateInteger').returns(this.data);

      this.result = lib.generateData({ type: 'integer' });
    });
    after(sandbox.restore);

    it('calls generateInteger', function () {
      expect(lib.generateInteger).to.be.calledWithExactly();
    });

    it('returns the generated integer', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with a boolean schema', function () {
    before(function () {
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateBoolean').returns(this.data);

      this.result = lib.generateData({ type: 'boolean' });
    });
    after(sandbox.restore);

    it('calls generateBoolean', function () {
      expect(lib.generateBoolean).to.be.calledWithExactly();
    });

    it('returns the generated boolean', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with an array schema', function () {
    before(function () {
      this.schema = { type: 'array' };
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateArray').returns(this.data);

      this.result = lib.generateData(this.schema);
    });
    after(sandbox.restore);

    it('calls generateArray', function () {
      expect(lib.generateArray).to.be.calledWithExactly(this.schema);
    });

    it('returns the generated array', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with an object schema', function () {
    before(function () {
      this.schema = { type: 'object' };
      this.data = Symbol('data');
      sandbox.stub(lib, 'generateObject').returns(this.data);

      this.result = lib.generateData(this.schema);
    });
    after(sandbox.restore);

    it('calls generateObject', function () {
      expect(lib.generateObject).to.be.calledWithExactly(this.schema);
    });

    it('returns the generated object', function () {
      expect(this.result).to.equal(this.data);
    });
  });

  context('with a schema with an unknown type', function () {
    it('throws an error', function () {
      const testFn = () => {
        lib.generateData({ type: 'whoops' });
      };

      expect(testFn).to.throw('Expected schema to have a known type but got "whoops"');
    });
  });
});
