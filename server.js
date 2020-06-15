var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/templates/list-gen", function (request, response) {
  response.sendFile(__dirname + '/src/list-gen.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
