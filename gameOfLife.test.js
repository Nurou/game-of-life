const gameOfLife = require('./gameOfLife.js');

/* 
Any live cell with two or three live neighbours survives.
Any dead cell with three live neighbours becomes a live cell.
All other live cells die in the next generation. Similarly, all other dead cells stay dead.
*/
describe('Game of life', () => {
  const path = process.cwd() + '/patterns/';
  it('should throw when the pattern file cannot be located', () => {
    const patternPath = 'nonExistent';
    const iterations = 2;
    expect(() => gameOfLife.play(patternPath, iterations)).toThrow();
  });
  it('should throw if the number of iterations is not provided', () => {
    const patternPath = path + 'gosperglidergun.rle';
    expect(() => gameOfLife.play(patternPath)).toThrow();
  });

  it('should be callable with a valid pattern file path and number of iterations as input', () => {
    const spy = jest.spyOn(gameOfLife, 'play');
    const patternPath = path + 'gosperglidergun.rle';
    const iterations = 2;
    gameOfLife.play(patternPath, iterations);
    expect(spy).toBeCalledWith(patternPath, iterations);
  });
});
