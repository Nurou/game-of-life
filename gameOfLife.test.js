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
    it('correctly converts pattern to a grid', () => {
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

  // describe('applyRules', () => {
  //   it('should ensure any cell with two or three live neighbours survives', () => {
  //     const initialGrid = [
  //       [0, 1, 0],
  //       [0, 0, 1],
  //       [1, 1, 1],
  //     ];
  //     const resultingGrid = gameOfLife.applyRules(initialGrid);
  //     expect(resultingGrid).toEqual(expectedGrid);
  //   })

  // });
});
