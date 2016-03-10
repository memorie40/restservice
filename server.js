var fs = require('fs');
var http = require('http');
var url = require('url');
var ROOT_DIR = "/home/bitnami/htdocs/cs360/Lab7/public";
console.log("Starting Node server on ROOT: " + ROOT_DIR);

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  console.log("Request: " + urlObj.toString());
  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
}).listen(8080);
