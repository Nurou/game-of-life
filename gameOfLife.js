const fs = require('fs');

function play(patternFile, iterations) {
  try {
    const data = fs.readFileSync(patternFile, 'utf8');
    console.log(data);
  } catch (err) {
    throw new Error('Patter file not found.');
  }
}

module.exports = { play };
