var express = require('express');
var app = express();

app.use(express.static('public'));

app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/templates/list-gen", function (request, response) {
  response.sendFile(__dirname + '/src/templates/list-gen.html');
});

const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, "src", "templates"), function (err, files) {
  if (err) { return console.log('Unable to scan directory: ' + err);}
  files.forEach(function (file) {
    app.get("/templates/" + file.replace(".html",""), function (request, response) {
      response.sendFile(path.join(__dirname, "src", "templates", file));
    });
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
