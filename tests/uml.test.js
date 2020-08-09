/**
 * @file I couldn't get the plant uml !include directive to work, so this will have to do for now
 */

const fs = require('fs');

const UML_DIR = 'uml';
const umlFilenames = fs.readdirSync(UML_DIR);
const filenamesAndLines = umlFilenames.map((filename) => {
  const contents = fs.readFileSync(`${UML_DIR}/${filename}`, 'utf8');
  const [relevantSection] = contents.match(/@startuml(\n|.)*title/);

  const relevantLines = relevantSection.split('\n');
  relevantLines.shift(); // remove @startuml line
  relevantLines.pop(); // remove title line

  return [filename, relevantLines];
});

describe('uml diagram style definitions', function () {
  filenamesAndLines.forEach(([filename, lines], index) => {
    const nextIndex = (index + 1) % filenamesAndLines.length;
    const [nextFilename, nextFilesLines] = filenamesAndLines[nextIndex];

    describe(filename, function () {
      it(`has the same style definition as "${nextFilename}"`, function () {
        expect(lines).to.eql(nextFilesLines);
      });
    });
  });
});
