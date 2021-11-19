const { expect } = require('chai');
const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');
const { setupCustomMocker } = require('./helpers/setupCustomMocker');

const sandbox = sinon.createSandbox();

describe('generateString', function () {
  context('when format and pattern are null', function () {
    before(function () {
      this.results = _.times(50, () => testUnit(
        defaultMocker,
        'generateString',
        {
          type: 'string',
          enum: null,
          format: null,
          pattern: null,
          minLength: 5,
          maxLength: 10,
        },
      ));
    });

    it('always returns a string', function () {
      expect(this.results).to.all.satisfy(_.isString);
    });

    it('always returns a string within the allowed range', function () {
      expect(this.results).to.all.satisfy((string) => string.length >= 5 && string.length <= 10);
    });

    it('sometimes returns a string of the min length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 5);
    });

    it('sometimes returns a string of the max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length === 10);
    });

    it('sometimes returns a string between the min and max length', function () {
      expect(this.results).to.include.something.that.satisfies((string) => string.length > 5 && string.length < 10);
    });
  });

  const supportedFormats = [
    ['date', 'a date'],
    ['date-time', 'a date-timestamp'],
    ['email', 'an email'],
    ['ipv4', 'an ipv4'],
    ['ipv6', 'an ipv6'],
    ['time', 'a timestamp'],
    ['uuid', 'a uuid'],
  ];

  supportedFormats.forEach(([format, description]) => {
    context(`with a schema with the ${format} format`, function () {
      before(function () {
        const coercedSchema = {
          type: 'string',
          enum: null,
          format,
          pattern: '^aabbcc$',
          minLength: 1,
          maxLength: 2,
        };

        this.results = _.times(10, () => testUnit(defaultMocker, 'generateString', coercedSchema));
      });

      it(`always ignores "pattern", "minLength" and "maxLength", returns ${description}`, function () {
        expect(this.results).to.all.be.jsonSchema({
          type: 'string',
          format,
        });
      });

      it('aways returns a random value', function () {
        const duplicates = _(this.results)
          .groupBy()
          .pickBy((resultGroup) => resultGroup.length > 5)
          .keys()
          .value();

        expect(duplicates).to.eql([]);
      });
    });
  });

  context('with a recognizeable pattern', function () {
    before(function () {
      sandbox.stub(defaultMocker, 'generateStringFromPattern')
        .withArgs('mock pattern')
        .returns('mock generated string');

      this.result = testUnit(
        defaultMocker,
        'generateString',
        {
          type: 'string',
          enum: null,
          format: null,
          pattern: 'mock pattern',
          minLength: 0,
          maxLength: 500,
        },
      );
    });
    after(sandbox.restore);

    it('passes the pattern to "generateStringFromPattern" and returns the generated value', function () {
      expect(this.result).to.equal('mock generated string');
    });
  });

  context.only('with a pattern that cannot be handled and mocker without " "', function () {
    it('throws an error', function () {
      const testFn = () => {
        testUnit(
          defaultMocker,
          'generateString',
          {
            type: 'string',
            enum: null,
            format: null,
            pattern: '^(?<!a)b$',
            minLength: 0,
            maxLength: 500,
          },
        );
      };

      // eslint-disable-next-line max-len
      expect(testFn).to.throw('Failed to generate data for regex pattern "^(?<!a)b$" due to: "Invalid regular expression: /^(?<!a)b$/: Invalid group, character \'<\' after \'?\' at column 3". If the pattern is valid, then consult the README for the "onUnknownPattern" option.');
    });
  });

  context.only('with a pattern that cannot be handled and a mocker with "onUnknownPattern" that returns a string', function () {
    const onUnknownPattern = sinon.stub().returns('mock value');
    setupCustomMocker({ onUnknownPattern });

    before(function () {
      this.result = testUnit(
        this.mocker,
        'generateString',
        {
          type: 'string',
          enum: null,
          format: null,
          pattern: '^(?<!a)b$',
          minLength: 0,
          maxLength: 500,
        },
      );
    });

    it('calls onUnknownPattern with the coerced schema', function () {
      expect(onUnknownPattern).to.be.called
        .and.to.be.calledWithExactly({
          type: 'string',
          enum: null,
          format: null,
          pattern: '^(?<!a)b$',
          minLength: 0,
          maxLength: 500,
        });
    });

    it('returns the data returned by onUnknownPattern', function () {
      expect(this.result).to.equal('mock value');
    });
  });

  context.only('with a pattern that cannot be handled and a mocker with "onUnknownPattern" that does not return a string', function () {
    const onUnknownPattern = sinon.stub().returns(123);
    setupCustomMocker({ onUnknownPattern });

    it('throws an error', function () {
      const testFn = () => {
        testUnit(
          this.mocker,
          'generateString',
          {
            type: 'string',
            enum: null,
            format: null,
            pattern: '^(?<!a)b$',
            minLength: 0,
            maxLength: 500,
          },
        );
      };

      expect(testFn).to.throw('"onUnknownPattern" must return a string');
    });
  });
});
