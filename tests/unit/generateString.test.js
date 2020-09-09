const _ = require('lodash');
const { defaultMocker } = require('../../lib/mocker');

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

  context('with a pattern', function () {
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
});
