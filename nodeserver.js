var http = require('http');
var url = require('url');
var fs = require('fs');

var ROOT_DIR = "/home/bitnami/htdocs/cs360/Lab7/public/";

console.log("Starting Node Server:  nodeserver.js");

http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);
  var myRe = new RegExp("^"+urlObj.query["q"]); 
  console.log(myRe);
  console.log("URL path "+urlObj.pathname); 
  console.log("URL search "+urlObj.search); 
  console.log("URL query "+urlObj.query["q"]);

  //Check to see if the request is for the REST service
  if (urlObj.pathname.indexOf("getcity") !=-1) { 
	// Execute the REST service 
    	console.log("In REST Service");
	
	fs.readFile('cities.dat.txt', function (err, data) {
          if(err) throw err;

	  var jsonresult = [];
          cities = data.toString().split("\n");

          for(var i = 0; i < cities.length; i++) {
            var result = cities[i].search(myRe);
	    if(result != -1)  {
		console.log(cities[i]);
		jsonresult.push({city:cities[i]});
	    }
          }
	  console.log (JSON.stringify(jsonresult));
	  res.writeHead(200);
	  res.end(JSON.stringify(jsonresult));
	});
  } 
  else { // Serve static files
	  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
	    if (err) {
	      res.writeHead(404);
	      res.end(JSON.stringify(err));
	      return;
	    }
	    res.writeHead(200);
	    res.end(data);
	    console.log("Response sent.");
	  });
  } 
}).listen(3001);

