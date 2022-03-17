const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  test('Solve a puzzle with valid puzzle string', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.solution,
          '769235418851496372432178956174569283395842761628713549283657194516924837947381625'
        );
      });
    done();
  });

  test('Solve a puzzle with missing puzzle string', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({ puzzle: '' })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field missing');
      });
    done();
  });

  test('Solve a puzzle with invalid characters', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.d'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      });
    done();
  });

  test('Solve a puzzle with incorrect length', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6...'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          'Expected puzzle to be 81 characters long'
        );
      });
    done();
  });

  test('Solve a puzzle that cannot be solved', done => {
    chai
      .request(server)
      .post('/api/solve')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..5..'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Puzzle cannot be solved');
      });
    done();
  });

  test('Check a puzzle placement with all fields', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'A2',
        value: '6'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
      });
    done();
  });

  test('Check a puzzle placement with single placement conflict', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'B5',
        value: '2'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ['row']);
      });
    done();
  });

  test('Check a puzzle placement with multiple placement conflicts', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'B5',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ['row', 'region']);
      });
    done();
  });

  test('Check a puzzle placement with all placement conflicts', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'a2',
        value: '5'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, false);
        assert.deepEqual(res.body.conflict, ['row', 'column', 'region']);
      });
    done();
  });

  test('Check a puzzle placement with missing required fields', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'a2',
        value: ''
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Required field(s) missing');
      });
    done();
  });

  test('Check a puzzle placement with invalid characters', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        coordinate: 'a2',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid characters in puzzle');
      });
    done();
  });

  test('Check a puzzle placement with incorrect length', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6...',
        coordinate: 'a2',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.body.error,
          'Expected puzzle to be 81 characters long'
        );
      });
    done();
  });

  test('Check a puzzle placement with invalid placement coordinate', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'ad',
        value: '3'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid coordinate');
      });
    done();
  });

  test('Check a puzzle placement with invalid placement value', done => {
    chai
      .request(server)
      .post('/api/check')
      .send({
        puzzle:
          '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....3.37.4.3..6..',
        coordinate: 'a3',
        value: 'd'
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Invalid value');
      });
    done();
  });
});
