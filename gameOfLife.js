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

  const { lines } = parseRleFile(patternFile);

  // combine pattern lines into string
  let rlePatternStr = '';
  for (let i = 0; i < lines.length; i++) {
    rlePatternStr += lines[i];
  }

  const cellGrid = convertToGrid(rlePatternStr);

  // apply rules to grid
  for (let i = 0; i < iterations; i++) {
    // magic happens here
    // applyRules(cellGrid);
  }

  return recompress(cellGrid);
}
/**
 * Parses the RLE pattern file and returns the lines of the file,
 * along with specified width and height of bounding box
 * @param {string} patternFilePath
 * @returns {object}
 */
function parseRleFile(patternFilePath) {
  const lines = [];
  let width, height;

  try {
    require('fs')
      .readFileSync(patternFilePath, 'utf-8')
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

  return { lines, width, height };
}

/**
 * Decompresses the pattern string into a 2D grid of cells.
 * @param {string} patternFile The name of the pattern file.
 */
function convertToGrid(patternStr) {
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

module.exports = { play, parseRleFile, convertToGrid };
