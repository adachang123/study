const debug = require('debug')('react2');
const express = require('express');
const path = require('path');
const app = express();

app.listen(3000, () => {
  debug('App listening on port 3000');
});

app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'index.html'));
})

app.use(express.static(path.join(__dirname, '/')))
