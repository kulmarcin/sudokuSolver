'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route('/api/check').post((req, res) => {
    const { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      res.json({ error: 'Required field(s) missing' });
      return;
    }

    const row = coordinate[0];
    const column = coordinate[1];

    const rowRegex = /[A-Za-z]/;
    const colAndValRegex = /[1-9]/;

    if (solver.validate(puzzle) === 'invalid characters') {
      res.json({ error: 'Invalid characters in puzzle' });
      return;
    } else if (solver.validate(puzzle) === 'incorrect length') {
      res.json({ error: 'Expected puzzle to be 81 characters long' });
      return;
    }

    if (!rowRegex.test(row) || !colAndValRegex.test(column)) {
      res.json({ error: 'Invalid coordinate' });
      return;
    }

    if (!colAndValRegex.test(value)) {
      res.json({ error: 'Invalid value' });
      return;
    }

    const conflicts = [];

    if (
      solver.checkRowPlacement(puzzle, row, column, value) &&
      solver.checkColPlacement(puzzle, row, column, value) &&
      solver.checkRegionPlacement(puzzle, row, column, value)
    ) {
      res.json({ valid: true });
      return;
    } else {
      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflicts.push('row');
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflicts.push('column');
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflicts.push('region');
      }

      res.json({ valid: false, conflict: conflicts });
    }
  });

  app.route('/api/solve').post((req, res) => {
    const { puzzle } = req.body;

    if (!puzzle) {
      res.json({ error: 'Required field missing' });
      return;
    }

    if (solver.validate(puzzle) === 'invalid characters') {
      res.json({ error: 'Invalid characters in puzzle' });
      return;
    } else if (solver.validate(puzzle) === 'incorrect length') {
      res.json({ error: 'Expected puzzle to be 81 characters long' });
      return;
    }
    const solution = solver.solve(puzzle);

    if (solution.includes('0')) {
      res.json({ error: 'Puzzle cannot be solved' });
      return;
    }

    res.json({ solution });
  });
};
