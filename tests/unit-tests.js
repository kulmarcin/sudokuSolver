const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('UnitTests', () => {
  test('Logic handles a valid puzzle string of 81 characters', done => {
    assert.equal(
      solver.validate(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      ),
      true
    );
    done();
  });

  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', done => {
    assert.equal(
      solver.validate(
        '..9..5.1.85.4....2432..d...1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      ),
      'invalid characters'
    );
    done();
  });

  test('Logic handles a puzzle string that is not 81 characters in length', done => {
    assert.equal(
      solver.validate(
        '..9..5.1.85.4....2432.....1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.....'
      ),
      'incorrect length'
    );
    done();
  });

  test('Logic handles a valid row placement', done => {
    assert.equal(
      solver.checkRowPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'a',
        '2',
        '2'
      ),
      true
    );
    done();
  });

  test('Logic handles an invalid row placement', done => {
    assert.equal(
      solver.checkRowPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'a',
        '2',
        '5'
      ),
      false
    );
    done();
  });

  test('Logic handles a valid column placement', done => {
    assert.equal(
      solver.checkColPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'd',
        '2',
        '1'
      ),
      true
    );
    done();
  });

  test('Logic handles an invalid column placement', done => {
    assert.equal(
      solver.checkColPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'c',
        '2',
        '5'
      ),
      false
    );
    done();
  });

  test('Logic handles a valid region (3x3 grid) placement', done => {
    assert.equal(
      solver.checkRegionPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'a',
        '2',
        '1'
      ),
      true
    );
    done();
  });

  test('Logic handles an invalid region (3x3 grid) placement', done => {
    assert.equal(
      solver.checkRegionPlacement(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
        'a',
        '2',
        '2'
      ),
      false
    );
    done();
  });

  test('Valid puzzle strings pass the solver', done => {
    assert.isString(
      solver.solve(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      )
    );
    done();
  });

  test('Invalid puzzle strings fail the solver', done => {
    assert.equal(
      solver.solve(
        '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..d'
      ),
      false
    );
    done();
  });

  test('Solver returns the expected solution for an incomplete puzzle', done => {
    assert.equal(
      solver.solve(
        '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'
      ),
      '473891265851726394926345817568913472342687951197254638734162589685479123219538746'
    );
    done();
  });
});
