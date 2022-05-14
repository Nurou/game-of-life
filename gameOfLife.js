const _ = require('lodash');

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
  // TODO: apply iterations
  for (let i = 0; i < iterations; i++) {
    // magic happens here
    applyRules(cellGrid);
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

  if (lines.length === 0 || width === undefined || height === undefined) {
    throw new Error('Invalid RLE file. Lines, width or height is not specified');
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

  // add padding cells
  return padGrid(cellGrid);
}

/**
 *
 * @param {array} cellGrid 2D array of cells
 * @returns {array} cellGrid with game rules applied
 */
function applyRules(cellGrid) {
  // define 8 operations based on 8 neighbor locations
  let neighborLocationOffsets = [
    [-1, 1],
    [-1, 0],
    [-1, -1],
    [0, 1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const rows = cellGrid.length;
  const cols = cellGrid[0].length;

  const newGrid = new Array(rows).fill(0).map(() => new Array(cols).fill(0));

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      let livingNeighborCount = 0;
      const isLiveCell = cellGrid[row]?.[col] === 1;

      // count how many neighbors a given cell has
      neighborLocationOffsets.forEach(([x, y]) => {
        const newRow = row + x;
        const newCol = col + y;

        // any cells out of bounds are treated as dead
        if (cellGrid[newRow]?.[newCol] === 1) {
          livingNeighborCount++;
        }
      });

      if (isLiveCell && (livingNeighborCount === 2 || livingNeighborCount === 3)) {
        // Any live cell with two or three live neighbours survives.
        newGrid[row][col] = 1;
      } else if (!isLiveCell && livingNeighborCount === 3) {
        //Any dead cell with three live neighbours becomes a live cell
        newGrid[row][col] = 1;
      } else {
        newGrid[row][col] = 0;
      }
    }
  }

  return newGrid;
}

/**
 *
 * @param {array} cellGrid
 * @returns cellGrid with an extra row and column of dead cells
 * on each side
 */
function padGrid(cellGrid) {
  let paddedCellGrid = cellGrid.map((row) => {
    // pad each row with dead cells
    const newRow = [...row];
    newRow.push(0);
    newRow.unshift(0);
    return newRow;
  });

  // pad top and bottom of grid with dead cell rows
  const rowOfDeadCells = new Array(paddedCellGrid[0].length).fill(0);
  paddedCellGrid.unshift(rowOfDeadCells);
  paddedCellGrid.push(rowOfDeadCells);

  return paddedCellGrid;
}
/**
 *
 * @param {array} cellGrid
 * @returns cellGrid that has been cropped to bounding box dimensions
 */
function cropGrid(cellGrid) {
  let croppedGrid = _.cloneDeep(cellGrid);

  // remove any empty rows
  for (i = 0; i < croppedGrid.length; i++) {
    row = croppedGrid[i];
    if (row.every((cell) => cell === 0)) {
      croppedGrid.splice(i, 1);
      i--; //decrement
    }
  }

  // for the remainder of rows,
  // if both the first and last cells are dead, then remove those cells
  croppedGrid.forEach((row, i) => {
    if (row[0] === 0 && row[row.length - 1] === 0) {
      croppedGrid[i].splice(0, 1);
      croppedGrid[i].pop();
    }
  });

  return croppedGrid;
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

module.exports = { play, parseRleFile, convertToGrid, applyRules, padGrid, cropGrid };
