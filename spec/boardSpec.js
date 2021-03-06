import _ from 'lodash';
import {Board} from '../lib/board.js';

describe('Board', function() {
  it('is initialized with a dimension', function () {
    var b = new Board(5, 6);
    expect(b.height).toEqual(5);
    expect(b.width).toEqual(6);
    expect(b.grid.length).toEqual(5);
    expect(b.grid[0].length).toEqual(6);
  });

  it('mark marks the position in the grid with a klass', function () {
    var b = new Board(5, 6);
    b.mark([1, 1], 'x');
    expect(b.at([0, 0])).toEqual(null);
    expect(b.at([1, 1])).toEqual('x');
  });

  it('place marks all cells generated by the tile', function () {
    var b = new Board(5, 6);
    var fakeTile = {
      cells: () => [[1, 1], [1, 2]],
      klass: 'x'
    };
    b.place(fakeTile);
    expect(b.empty([0, 0])).toBe(true);
    expect(b.at([1, 1])).toEqual('x');
    expect(b.at([1, 2])).toEqual('x');
  });

  it('empty is true if no tile type class is on the grid', function () {
    var b = new Board(5, 6);
    expect(b.empty([0, 0])).toEqual(true);
  });

  it('atBottom is true if cells in the tile touch bottom of grid', function () {
    var b = new Board(5, 6);
    var fakeTile = { cells: () => [[4, 0]] };
    expect(b.atBottom(fakeTile)).toEqual(true);
  });

  it('atBottom is false if no cells in the tile touch bottom of grid', function () {
    var b = new Board(5, 6);
    var fakeTile = { cells: () => [[1, 0]] };
    expect(b.atBottom(fakeTile)).toEqual(false);
  });

  it('atBottom is true if cells in the tile touch top of other tiles', function () {
    var b = new Board(5, 6);
    b.mark([4, 0], 'x');
    var fakeTile = { cells: () => [[3, 0]] };
    expect(b.atBottom(fakeTile)).toEqual(true);
  });

  it('atBottom is false if cells in the tile dont touch top of other tiles', function () {
    var b = new Board(5, 6);
    b.mark([4, 0], 'x');
    var fakeTile = { cells: () => [[2, 0]] };
    expect(b.atBottom(fakeTile)).toEqual(false);
  });

  it('fits when cells are on board do not overlap', function () {
    var b = new Board(5, 6);
    b.mark([4, 0], 'x');
    var fakeTile = { cells: () => [[-2, 0]] };
    expect(b.fits(fakeTile)).toBe(false);
    var fakeTile = { cells: () => [[2, 6]] };
    expect(b.fits(fakeTile)).toBe(false);
  });

  it('fits when cells do not overlap', function () {
    var b = new Board(5, 6);
    b.mark([4, 0], 'x');
    var fakeTile = { cells: () => [[2, 0]] };
    expect(b.fits(fakeTile)).toBe(true);
    b.mark([2, 0], 'x');
    expect(b.fits(fakeTile)).toBe(false);
  });

  it('freeze updates the frozen grid', function () {
    var b = new Board(5, 6);
    var fakeTile = { klass: 'x', cells: () => [[2, 0]] };
    b.freeze(fakeTile);
    expect(b.frozenGrid[2][0]).toEqual('x');
  });
});
