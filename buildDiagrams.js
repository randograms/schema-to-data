/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const path = require('path');
const plantuml = require('node-plantuml');

const UML_DIR = 'uml';
const OUT_DIR = 'build';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

const umlFilenames = fs.readdirSync(UML_DIR);

umlFilenames.forEach((filename) => {
  const basename = path.basename(filename, '.puml');

  const gen = plantuml.generate(`${UML_DIR}/${filename}`);
  gen.out.pipe(fs.createWriteStream(`${OUT_DIR}/${basename}.png`));
});
