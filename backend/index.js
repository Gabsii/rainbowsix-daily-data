var express = require('express');
var app = express();

app.get('/today', function (req, res) {
  res.send('Hello World!');
});

app.get('/yesterday', function (req, res) {
  res.send('Hello World!');
})

app.get('/week', function (req, res) {
  res.send('Hello World!');
})

app.get('/month', function (req, res) {
  res.send('Hello World!');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});