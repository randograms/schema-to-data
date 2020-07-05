/* eslint-disable import/no-extraneous-dependencies */

const fs = require('fs');
const plantuml = require('node-plantuml');

const OUT_DIR = 'build';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

const gen = plantuml.generate('flowchart.puml');
gen.out.pipe(fs.createWriteStream(`${OUT_DIR}/flowchart.png`));
