var express = require('express');
var app = express();
const PORT = process.env["PORT"];

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.listen(PORT, function () {
  console.log(`Server listening on port ${PORT}...`);
});
