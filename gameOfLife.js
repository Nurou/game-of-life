const fs = require('fs');

function play(patternFile, iterations) {
  if (!iterations) {
    throw new Error('Number of game iterations must be provided');
  }
  try {
    const data = fs.readFileSync(patternFile, 'utf8');
  } catch (err) {
    throw new Error('Patter file not found');
  }
}

module.exports = { play };
