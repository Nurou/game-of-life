const gameOfLife = require('./gameOfLife.js');

const basePath = process.cwd() + '/patterns/';

const patternFile = process.argv[2];
const iterations = process.argv[3];
if (!patternFile) {
  console.log(
    'Please provide the name of the pattern file as the first argument. To add a new patterns, place the RLE file in the patterns directory'
  );
  process.exit(0);
}
if (!iterations) {
  console.log('Please provide the number of iterations as the second argument');
  process.exit(0);
}

gameOfLife.play(basePath + patternFile, iterations);
