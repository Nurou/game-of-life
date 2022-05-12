const gameOfLife = require('./gameOfLife.js');

/* 
Any live cell with two or three live neighbours survives.
Any dead cell with three live neighbours becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/

describe('Game of life', () => {
  // write integration tests here after testing specific functions
  const path = process.cwd() + '/patterns/';
  describe('play', () => {
    it('should throw if the number of iterations is not provided', () => {
      const patternPath = path + 'gosperglidergun.rle';
      expect(() => gameOfLife.play(patternPath)).toThrow();
    });
    it('should throw if the iteration count is less than 0', () => {
      const patternPath = path + 'gosperglidergun.rle';
      expect(() => gameOfLife.play(patternPath, -1)).toThrow();
    });
    it('should not modify the original RLE pattern if iteration count is 0', () => {
      const patternPath = path + 'glider.rle';
      const expectedRes = 'bob$2bo$3o!';
      const res = gameOfLife.play(patternPath, 0);
      expect(res).toEqual(expectedRes);
    });

    it('should be callable with a valid pattern file path and number of iterations as input', () => {
      const spy = jest.spyOn(gameOfLife, 'play');
      const patternPath = path + 'gosperglidergun.rle';
      const iterations = 2;
      gameOfLife.play(patternPath, iterations);
      expect(spy).toBeCalledWith(patternPath, iterations);
    });
  });
  describe('parseRleFile', () => {
    it('should return the correct data and lines when a valid file path is provided', () => {
      const patternPath = path + 'glider.rle';
      const res = gameOfLife.parseRleFile(patternPath);
      expect(res).toEqual({
        lines: ['bob$2bo$3o!'],
        width: 3,
        height: 3,
      });
    });

    it('should throw when the pattern file cannot be located', () => {
      const patternPath = 'nonExistent';
      expect(() => gameOfLife.parseRleFile(patternPath)).toThrow();
    });

    it('should throw if necessary data is missing RLE file', () => {
      const patternPath = path + 'glider_missing_data.rle';
      expect(() => gameOfLife.parseRleFile(patternPath)).toThrow();
    });
  });

  describe('convertToGrid', () => {
    it('correctly converts pattern to a padded grid', () => {
      const pattern = 'bob$2bo$3o!';
      const resultingGrid = gameOfLife.convertToGrid(pattern);

      const expectedGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      expect(resultingGrid).toEqual(expectedGrid);
    });
  });

  describe('applyRules', () => {
    it('should ensure any live cell with two or three live neighbours survives', () => {
      const initialGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const shouldSurvive = [
        [2, 3],
        [3, 2],
        [3, 3],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldSurvive.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(1);
      });
    });
    it('should ensure any dead cell with three live neighbours becomes a live cell.', () => {
      const initialGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const shouldSurvive = [
        [2, 1],
        [4, 2],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldSurvive.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(1);
      });
    });

    it('should ensure that live cells without 2 or 3 living neighbors die in the next generation', () => {
      const initialGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const shouldDie = [
        [1, 2],
        [3, 1],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldDie.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(0);
      });
    });
    it('should ensure that all dead cells without 3 living neighbors remain dead', () => {
      const initialGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const shouldDie = [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 0],
        [1, 1],
        [1, 3],
        [1, 4],
        [2, 0],
        [2, 2],
        [2, 4],
        [3, 1],
        [3, 4],
        [4, 0],
        [4, 1],
        [4, 3],
        [4, 4],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldDie.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(0);
      });
    });
  });
});
