class SudokuSolver {
  validate(puzzleString) {
    const regex = /[^\.^1-9]/g; //not dot and not 1-9

    if (regex.test(puzzleString)) {
      return 'invalid characters';
    }

    if (puzzleString.length === 81) {
      return true;
    } else {
      return 'incorrect length';
    }
  }

  checkRowPlacement(puzzleString, row, column, value) {
    const grid = this.toGrid(puzzleString);
    const r = this.letterToNumber(row);
    const v = +value;
    const c = +column;

    if (grid[r - 1][c - 1] === v) {
      return true;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[r - 1][i] === v) {
        return false;
      }
    }

    if (grid[r - 1][c - 1] !== 0) {
      return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    const grid = this.toGrid(puzzleString);
    const r = this.letterToNumber(row);
    const v = +value;
    const c = +column;

    if (grid[r - 1][c - 1] === v) {
      return true;
    }

    if (grid[r - 1][c - 1] !== 0) {
      return false;
    }

    for (let i = 0; i < 9; i++) {
      if (grid[i][c - 1] === v) {
        return false;
      }
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const grid = this.toGrid(puzzleString);
    const r = this.letterToNumber(row);
    const v = +value;
    const c = +column;
    const region = [];

    if (grid[r - 1][c - 1] === v) {
      return true;
    }

    if (r <= 3 && c <= 3) {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 3 && c <= 6) {
      for (let i = 0; i < 3; i++) {
        for (let j = 3; j < 6; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 3 && c <= 9) {
      for (let i = 0; i < 3; i++) {
        for (let j = 6; j < 9; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 6 && c <= 3) {
      for (let i = 3; i < 6; i++) {
        for (let j = 0; j < 3; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 6 && c <= 6) {
      for (let i = 3; i < 6; i++) {
        for (let j = 3; j < 6; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 6 && c <= 9) {
      for (let i = 3; i < 6; i++) {
        for (let j = 6; j < 9; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 9 && c <= 3) {
      for (let i = 6; i < 9; i++) {
        for (let j = 0; j < 3; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 9 && c <= 6) {
      for (let i = 6; i < 9; i++) {
        for (let j = 3; j < 6; j++) {
          region.push(grid[i][j]);
        }
      }
    } else if (r <= 9 && c <= 9) {
      for (let i = 6; i < 9; i++) {
        for (let j = 6; j < 9; j++) {
          region.push(grid[i][j]);
        }
      }
    }

    for (let i = 0; i < region.length; i++) {
      if (region[i] === v) {
        return false;
      }
    }

    return true;
  }

  solve(puzzleString) {
    const grid = this.toGrid(puzzleString);

    if (
      this.validate(puzzleString) === 'incorrect length' ||
      this.validate(puzzleString) === 'invalid characters'
    ) {
      return false;
    }

    this.solveSudoku(grid, 0, 0);

    return this.flattenAndJoin(grid);
  }

  solveSudoku(grid, row, col) {
    let N = 9;
    if (row == N - 1 && col == N) return true;

    if (col == N) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSudoku(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSudoku(grid, row, col + 1)) return true;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    for (let x = 0; x <= 8; x++) if (grid[row][x] == num) return false;

    for (let x = 0; x <= 8; x++) if (grid[x][col] == num) return false;

    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + startRow][j + startCol] == num) return false;

    return true;
  }

  flattenAndJoin(g) {
    const result = [];

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        result.push(g[i][j]);
      }
    }

    return result.join('');
  }

  toGrid(puzzleString) {
    const grid = [[], [], [], [], [], [], [], [], []];

    const arr = puzzleString.split('');

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const el = arr.splice(0, 1);
        grid[i].push(el[0]);
      }
    }

    const result = [];

    for (let i = 0; i < 9; i++) {
      let arr = [];
      for (let j = 0; j < 9; j++) {
        let el = grid[i].splice(0, 1);
        el = this.toNumber(el[0]);
        arr.push(el);
      }
      result.push(arr);
      arr = [];
    }
    return result;
  }

  toNumber(n) {
    if (n === '.') {
      return 0;
    } else {
      return +n;
    }
  }

  letterToNumber(l) {
    const letter = l.toUpperCase();
    switch (letter) {
      case 'A':
        return 1;
      case 'B':
        return 2;
      case 'C':
        return 3;
      case 'D':
        return 4;
      case 'E':
        return 5;
      case 'F':
        return 6;
      case 'G':
        return 7;
      case 'H':
        return 8;
      case 'I':
        return 9;
      default:
        return 'none';
    }
  }
}

module.exports = SudokuSolver;
