const fs = require('fs');

const originalGitignore = fs.readFileSync('.gitignore', 'utf8');
const updatedGitignore = originalGitignore.split('\n').filter((rule) => !/^\/build$/.test(rule)).join('\n');

fs.writeFileSync('.gitignore', updatedGitignore);
