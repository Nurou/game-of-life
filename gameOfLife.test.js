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
    it('throws if the number of iterations is not provided', () => {
      const patternPath = path + 'gosperglidergun.rle';
      expect(() => gameOfLife.play(patternPath)).toThrow();
    });
    it('throws if the iteration count is less than 0', () => {
      const patternPath = path + 'gosperglidergun.rle';
      expect(() => gameOfLife.play(patternPath, -1)).toThrow();
    });
    it('does not modify the original RLE pattern if iteration count is 0', () => {
      const patternPath = path + 'glider.rle';
      const expectedRes = 'bob$2bo$3o!';
      const res = gameOfLife.play(patternPath, 0);
      expect(res).toEqual(expectedRes);
    });

    it('is callable with a valid pattern file path and number of iterations as input', () => {
      const spy = jest.spyOn(gameOfLife, 'play');
      const patternPath = path + 'gosperglidergun.rle';
      const iterations = 2;
      gameOfLife.play(patternPath, iterations);
      expect(spy).toBeCalledWith(patternPath, iterations);
    });
  });
  describe('parseRleFile', () => {
    it('returns the correct data and lines when a valid file path is provided', () => {
      const patternPath = path + 'glider.rle';
      const res = gameOfLife.parseRleFile(patternPath);
      expect(res).toEqual({
        lines: ['bob$2bo$3o!'],
        width: 3,
        height: 3,
      });
    });

    it('throws when the pattern file cannot be located', () => {
      const patternPath = 'nonExistent';
      expect(() => gameOfLife.parseRleFile(patternPath)).toThrow();
    });

    it('throws if necessary data is missing RLE file', () => {
      const patternPath = path + 'glider_missing_data.rle';
      expect(() => gameOfLife.parseRleFile(patternPath)).toThrow();
    });
  });

  describe('convertToGrid', () => {
    it('correctly converts pattern to a padded grid', () => {
      const pattern = 'bob$2bo$3o!';
      const resultingGrid = gameOfLife.convertToGrid(pattern);

      const expectedGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      expect(resultingGrid).toEqual(expectedGrid);
    });
  });

  describe('padGrid', () => {
    it('pads a grid with an extra top and bottom row and right and left column of dead cells', () => {
      const initialGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];
      const expectedGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];

      const resultingGrid = gameOfLife.padGrid(initialGrid);
      expect(resultingGrid).toEqual(expectedGrid);
    });
  });
  describe('cropGrid', () => {
    it('removes all cells exceeding bounding box dimensions', () => {
      const initialGrid = [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0],
        [0, 0, 1, 1, 0],
        [0, 0, 1, 0, 0],
      ];

      const expectedGrid = [
        [1, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ];

      const resultingGrid = gameOfLife.cropGrid(initialGrid);
      expect(resultingGrid).toEqual(expectedGrid);
    });
  });

  describe('applyRules', () => {
    it('ensures any live cell with two or three live neighbours survives', () => {
      const initialGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];

      const shouldSurvive = [
        [1, 2],
        [2, 1],
        [1, 2],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldSurvive.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(1);
      });
    });

    it('ensures that live cells without 2 or 3 living neighbors die in the next generation', () => {
      const initialGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];

      const shouldDie = [
        [0, 1],
        [2, 0],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      shouldDie.forEach(([row, col]) => {
        expect(resultingGrid[row][col]).toEqual(0);
      });
    });
    it('ensures that all dead cells without 3 living neighbors remain dead', () => {
      const initialGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      expect(resultingGrid[1][0]).toEqual(0);
    });

    it('results in a correctly transformed grid by applying all the rules', () => {
      const initialGrid = [
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 1],
      ];

      const resultingGrid = gameOfLife.applyRules(initialGrid);

      expect(resultingGrid).toEqual([
        [1, 0, 1],
        [0, 1, 1],
        [0, 1, 0],
      ]);
    });

    describe('when further iterations are run', () => {
      it('results in a correctly transformed grid ', () => {
        const initialGrid = [
          [0, 1, 0],
          [0, 0, 1],
          [1, 1, 1],
        ];

        let firstIterationResult = gameOfLife.applyRules(initialGrid);

        expect(firstIterationResult).toEqual([
          [1, 0, 1],
          [0, 1, 1],
          [0, 1, 0],
        ]);

        const secondIterationResult = gameOfLife.applyRules(firstIterationResult);

        expect(secondIterationResult).toEqual([
          [0, 0, 1],
          [1, 0, 1],
          [0, 1, 1],
        ]);
      });
    });
  });
});
