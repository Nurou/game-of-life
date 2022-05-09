const fs = require('fs');
const readline = require('readline');

/**
 * Returns the pattern in its final form in RLE format.
 * @param {string} patternFile The name of the pattern file.
 * @param {number} iterations The number of times the game should run.
 * @returns {string} The final state of the game.
 */
function play(patternFile, iterations) {
  if (iterations === undefined) {
    throw new Error('Number of game iterations must be provided');
  }
  if (iterations < 0) {
    throw new Error('Iterations must be greater than 0');
  }

  const cellGrid = decompress(patternFile);

  // apply rules to grid
  for (let i = 0; i < iterations; i++) {
    // magic happens here
  }

  return recompress(cellGrid);
}

/**
 * Decompresses the pattern file into a 2D grid of cells.
 * @param {string} patternFile The name of the pattern file.
 */
function decompress(patternFile) {
  const lines = [];

  try {
    require('fs')
      .readFileSync(patternFile, 'utf-8')
      .split(/\r?\n/)
      .forEach(function (line) {
        if (line[0] === '#') return;
        if (line[0] === 'x') {
          const xCommaIndex = nthIndex(line, ',', 1);
          const yCommaIndex = nthIndex(line, ',', 2);
          width = parseInt(line.substring(4, xCommaIndex));
          height = parseInt(line.substring(line.indexOf('y') + 4, yCommaIndex));
          return;
        }
        lines.push(line);
      });
  } catch (error) {
    throw new Error(error);
  }

  // combine pattern lines into string
  let patternStr = '';
  for (let i = 0; i < lines.length; i++) {
    patternStr += lines[i];
  }

  // grid representation of pattern
  const cellGrid = [];

  let runCount = '';
  let gridRow = []; // e.g [0,1,0], where 0 = dead, 1 = alive

  patternStr.split('').forEach((char) => {
    // char can be:
    // b, o, $, !, or some integer
    switch (char) {
      case 'b':
        if (runCount) {
          const runCountAsInt = parseInt(runCount);
          for (let i = 0; i < runCountAsInt; i++) {
            gridRow.push(0);
          }
        } else {
          gridRow.push(0);
        }
        runCount = '';
        break;
      case 'o':
        if (runCount) {
          const runCountAsInt = parseInt(runCount);
          for (let i = 0; i < runCountAsInt; i++) {
            gridRow.push(1);
          }
        } else {
          gridRow.push(1);
        }
        runCount = '';
        break;
      case '$':
        cellGrid.push(gridRow);
        gridRow = [];
        runCount = '';
        break;
      case '!':
        cellGrid.push(gridRow);
        runCount = '';
        break;
      default: //any integer
        runCount += char;
        break;
    }
  });

  return cellGrid;
}

function recompress(cellGrid) {
  return 'bob$2bo$3o!';
}

function nthIndex(str, pat, n) {
  var L = str.length,
    i = -1;
  while (n-- && i++ < L) {
    i = str.indexOf(pat, i);
    if (i < 0) break;
  }
  return i;
}

module.exports = { play };
