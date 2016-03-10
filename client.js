var http = require('http');

var options = {
    hostname: 'localhost',
    port: '8080',
    path: '/Lab6.html'
  };
function handleResponse(response) {
  var serverData = '';
  response.on('data', function (chunk) {
    serverData += chunk;
  });
  response.on('end', function () {
    console.log(serverData);
  });
  response.on('err', function () {
    console.log("Error : " + err);
  });
}
http.request(options, function(response){
  handleResponse(response);
}).end();
