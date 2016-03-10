client.js                                                                                           0000664 0001750 0001750 00000000735 12666076715 012551  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                var http = require('http');

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
                                   nodeserver.js                                                                                       0000664 0001750 0001750 00000002656 12670136636 013445  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                var http = require('http');
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

                                                                                  server.js                                                                                           0000664 0001750 0001750 00000001055 12665746446 012601  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                var fs = require('fs');
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
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   index.html                                                                                          0000644 0001750 0001750 00000010256 12670132730 012710  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                <!DOCTYPE html>
<html>
<head>
<title>City Finder</title>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>


</head>
<body>
<h1>Weather Finder</h1>
<form>
Enter A Utah City: <input type="text" id="cityfield" value="">  <input id="button" type="submit" value="Submit"><br>
Suggestion: <span id="txtHint">Empty</span><br>

</form>
<p>City</p>
<textarea id="dispcity">City Selected</textarea>
<p><h2>Current Weather</h2></p>
<div id="weather">No weather</div><br><br>
<p><h1>The greatest comic in the world: Strange Quark</h1></p>
<a href="http://sqcomic.com/"><img src="http://sqcomic.com/sqcomic.jpg" alt="Strange Quark Comic"></a><br>
<br>
<br>
<p><h1>Automated Decision Maker</h1></p>
<p><strong>Ask me a yes or no question, and I will help you make a decision.</strong><br>
<div style="color:red">Scroll down to see the response!</div></p>
<input type ="text" id="question" value="">  <input id="questionbutton" type="submit" value= "Submit Question"><br>
<textarea id="echoquestion">What's your question</textarea><br>
<div id="answerimage">No Answer</div>


  
<script>
  
$(document).ready(function() {
  
  $( "#cityfield" ).keyup(function() {
    var url = "http://ec2-52-33-245-25.us-west-2.compute.amazonaws.com:3001/getcity?q="+$("#cityfield").val();
  
    $.getJSON(url,function(data)
    {
      var everything;
      everything = "<ul>";
      $.each(data, function(i,item) 
      {
        everything += "<li> "+data[i].city;
      });
      
      everything += "</ul>";
      $("#txtHint").html(everything);
    })
    .done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    })
    .complete(function() { console.log("complete"); });
  }); //end keyup
  }); //end document.ready 

  $("#button").click(function(e)
  {
  var value = $("#cityfield").val();
  console.log(value);
  $("#dispcity").text(value);
  e.preventDefault();
  var myurl= "https://api.wunderground.com/api/1ec1fa6580677380/geolookup/conditions/q/UT/";
  myurl += value;
  myurl += ".json";
  console.log(myurl);
  $.ajax({
    type: "GET",
    url : myurl,
    contentType: "application/json; charset=utf-8",
    dataType : "jsonp",
    success: function (parsed_json) {
      var location = parsed_json['location']['city'];
      var temp_string = parsed_json['current_observation']['temperature_string'];
      var current_weather = parsed_json['current_observation']['weather'];
      var everything = "<ul>";
      everything += "<li>Location: "+location;
      everything += "<li>Temperature: "+temp_string;
      everything += "<li>Weather: "+current_weather;
      everything += "</ul>";
	  console.log(everything);
      $("#weather").html(everything);
    },

    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #button.click  
 
 $("#questionbutton").click(function(e)
  {
  var value = $("#question").val();
  console.log(value);
  $("#echoquestion").text(value);
  e.preventDefault();
  var answerurl= "http://yesno.wtf/api";
  //answerurl += ".json";
  console.log(answerurl);
  $.ajax({
    type: "GET",
    url : answerurl,
    //contentType: "application/json; charset=utf-8",
    //dataType : "jsonp",
    success: function (parsed_json) {
      var answer = parsed_json['answer'];
      var image = parsed_json['image'];
      var everything = "<h2>";
      everything += answer + "</h2><br><br>";
	  everything += "<img src='" ;
	  everything += image;
	  everything += "'>";
	  console.log(everything);
      $("#answerimage").html(everything);
    },
    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #questionbutton.click  
</script>
</body>
</html>
                                                                                                                                                                                                                                                                                                                                                  Lab6.html                                                                                           0000644 0001750 0001750 00000010256 12666111570 012371  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                <!DOCTYPE html>
<html>
<head>
<title>City Finder</title>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>


</head>
<body>
<h1>Weather Finder</h1>
<form>
Enter A Utah City: <input type="text" id="cityfield" value="">  <input id="button" type="submit" value="Submit"><br>
Suggestion: <span id="txtHint">Empty</span><br>

</form>
<p>City</p>
<textarea id="dispcity">City Selected</textarea>
<p><h2>Current Weather</h2></p>
<div id="weather">No weather</div><br><br>
<p><h1>The greatest comic in the world: Strange Quark</h1></p>
<a href="http://sqcomic.com/"><img src="http://sqcomic.com/sqcomic.jpg" alt="Strange Quark Comic"></a><br>
<br>
<br>
<p><h1>Automated Decision Maker</h1></p>
<p><strong>Ask me a yes or no question, and I will help you make a decision.</strong><br>
<div style="color:red">Scroll down to see the response!</div></p>
<input type ="text" id="question" value="">  <input id="questionbutton" type="submit" value= "Submit Question"><br>
<textarea id="echoquestion">What's your question</textarea><br>
<div id="answerimage">No Answer</div>


  
<script>
  
$(document).ready(function() {
  
  $( "#cityfield" ).keyup(function() {
    var url = "http://ec2-52-33-245-25.us-west-2.compute.amazonaws.com:3000/getcity?q="+$("#cityfield").val();
  
    $.getJSON(url,function(data)
    {
      var everything;
      everything = "<ul>";
      $.each(data, function(i,item) 
      {
        everything += "<li> "+data[i].city;
      });
      
      everything += "</ul>";
      $("#txtHint").html(everything);
    })
    .done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    })
    .complete(function() { console.log("complete"); });
  }); //end keyup
  }); //end document.ready 

  $("#button").click(function(e)
  {
  var value = $("#cityfield").val();
  console.log(value);
  $("#dispcity").text(value);
  e.preventDefault();
  var myurl= "https://api.wunderground.com/api/1ec1fa6580677380/geolookup/conditions/q/UT/";
  myurl += value;
  myurl += ".json";
  console.log(myurl);
  $.ajax({
    type: "GET",
    url : myurl,
    contentType: "application/json; charset=utf-8",
    dataType : "jsonp",
    success: function (parsed_json) {
      var location = parsed_json['location']['city'];
      var temp_string = parsed_json['current_observation']['temperature_string'];
      var current_weather = parsed_json['current_observation']['weather'];
      var everything = "<ul>";
      everything += "<li>Location: "+location;
      everything += "<li>Temperature: "+temp_string;
      everything += "<li>Weather: "+current_weather;
      everything += "</ul>";
	  console.log(everything);
      $("#weather").html(everything);
    },

    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #button.click  
 
 $("#questionbutton").click(function(e)
  {
  var value = $("#question").val();
  console.log(value);
  $("#echoquestion").text(value);
  e.preventDefault();
  var answerurl= "http://yesno.wtf/api";
  //answerurl += ".json";
  console.log(answerurl);
  $.ajax({
    type: "GET",
    url : answerurl,
    //contentType: "application/json; charset=utf-8",
    //dataType : "jsonp",
    success: function (parsed_json) {
      var answer = parsed_json['answer'];
      var image = parsed_json['image'];
      var everything = "<h2>";
      everything += answer + "</h2><br><br>";
	  everything += "<img src='" ;
	  everything += image;
	  everything += "'>";
	  console.log(everything);
      $("#answerimage").html(everything);
    },
    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #questionbutton.click  
</script>
</body>
</html>
                                                                                                                                                                                                                                                                                                                                                  test1.html                                                                                          0000664 0001750 0001750 00000000510 12665727053 012647  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                <HTML>
<HEAD>
<TITLE>Test file for HTML</TITLE>
</HEAD>
<BODY BGCOLOR=#FFFFFF TEXT=#000000>
<p>
<H2>Test file for HTML</H2>
<p>
This is a test file for HTML.

<ol>
<li> Test
<li> Test
<li> Test
<li> Test
</ol>
<P>
<hr align=left width=20%>
<FONT SIZE=-1> <I> Last Updated:</I> 10 March 1998<br> </FONT>

</FONT>
</BODY>
</HTML>
                                                                                                                                                                                        weather.html                                                                                        0000644 0001750 0001750 00000010256 12670133554 013245  0                                                                                                    ustar   bitnami                         bitnami                                                                                                                                                                                                                <!DOCTYPE html>
<html>
<head>
<title>City Finder</title>
<script type="text/javascript" src="https://code.jquery.com/jquery-1.10.2.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.js"></script>


</head>
<body>
<h1>Weather Finder</h1>
<form>
Enter A Utah City: <input type="text" id="cityfield" value="">  <input id="button" type="submit" value="Submit"><br>
Suggestion: <span id="txtHint">Empty</span><br>

</form>
<p>City</p>
<textarea id="dispcity">City Selected</textarea>
<p><h2>Current Weather</h2></p>
<div id="weather">No weather</div><br><br>
<p><h1>The greatest comic in the world: Strange Quark</h1></p>
<a href="http://sqcomic.com/"><img src="http://sqcomic.com/sqcomic.jpg" alt="Strange Quark Comic"></a><br>
<br>
<br>
<p><h1>Automated Decision Maker</h1></p>
<p><strong>Ask me a yes or no question, and I will help you make a decision.</strong><br>
<div style="color:red">Scroll down to see the response!</div></p>
<input type ="text" id="question" value="">  <input id="questionbutton" type="submit" value= "Submit Question"><br>
<textarea id="echoquestion">What's your question</textarea><br>
<div id="answerimage">No Answer</div>


  
<script>
  
$(document).ready(function() {
  
  $( "#cityfield" ).keyup(function() {
    var url = "http://ec2-52-33-245-25.us-west-2.compute.amazonaws.com:3001/getcity?q="+$("#cityfield").val();
  
    $.getJSON(url,function(data)
    {
      var everything;
      everything = "<ul>";
      $.each(data, function(i,item) 
      {
        everything += "<li> "+data[i].city;
      });
      
      everything += "</ul>";
      $("#txtHint").html(everything);
    })
    .done(function() { console.log('getJSON request succeeded!'); })
    .fail(function(jqXHR, textStatus, errorThrown) { 
      console.log('getJSON request failed! ' + textStatus); 
      console.log("incoming "+jqXHR.responseText);
    })
    .always(function() { console.log('getJSON request ended!');
    })
    .complete(function() { console.log("complete"); });
  }); //end keyup
  }); //end document.ready 

  $("#button").click(function(e)
  {
  var value = $("#cityfield").val();
  console.log(value);
  $("#dispcity").text(value);
  e.preventDefault();
  var myurl= "https://api.wunderground.com/api/1ec1fa6580677380/geolookup/conditions/q/UT/";
  myurl += value;
  myurl += ".json";
  console.log(myurl);
  $.ajax({
    type: "GET",
    url : myurl,
    contentType: "application/json; charset=utf-8",
    dataType : "jsonp",
    success: function (parsed_json) {
      var location = parsed_json['location']['city'];
      var temp_string = parsed_json['current_observation']['temperature_string'];
      var current_weather = parsed_json['current_observation']['weather'];
      var everything = "<ul>";
      everything += "<li>Location: "+location;
      everything += "<li>Temperature: "+temp_string;
      everything += "<li>Weather: "+current_weather;
      everything += "</ul>";
	  console.log(everything);
      $("#weather").html(everything);
    },

    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #button.click  
 
 $("#questionbutton").click(function(e)
  {
  var value = $("#question").val();
  console.log(value);
  $("#echoquestion").text(value);
  e.preventDefault();
  var answerurl= "http://yesno.wtf/api";
  //answerurl += ".json";
  console.log(answerurl);
  $.ajax({
    type: "GET",
    url : answerurl,
    //contentType: "application/json; charset=utf-8",
    //dataType : "jsonp",
    success: function (parsed_json) {
      var answer = parsed_json['answer'];
      var image = parsed_json['image'];
      var everything = "<h2>";
      everything += answer + "</h2><br><br>";
	  everything += "<img src='" ;
	  everything += image;
	  everything += "'>";
	  console.log(everything);
      $("#answerimage").html(everything);
    },
    error: function (jqXHR, status) {
      // error handler
      console.log("Error : " + status);
    }
    
  });//end ajax    
  }); //end #questionbutton.click  
</script>
</body>
</html>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  