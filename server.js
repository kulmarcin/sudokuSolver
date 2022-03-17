const express = require('express');

const apiRoutes = require('./routes/api.js');

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Index page
app.route('/').get(function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Routes
apiRoutes(app);

//404 Not Found Middleware
app.use((req, res, next) => {
  res.status(404).type('text').send('Not Found');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

module.exports = app; // for test
