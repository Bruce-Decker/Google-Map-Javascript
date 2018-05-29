var express = require('express')
var app = express();
var bodyParser = require('body-parser');


app.use(express.static("./"));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); 
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(bodyParser.json({limit: '50mb'}));
var curr_dir = process.cwd()
app.get('/', function(req, res) {
     res.sendFile(curr_dir +'/Map.html');
});
app.listen(3000);
console.log("Running app at port 3000");
var curr_dir = process.cwd()
app.get('/locations', function(req, res) {
     res.sendFile(curr_dir + '/mapData.json');
});

var json_var
app.post('/locations2', function(req, res) {
	//console.log(req);
	
    json_var = req.body
     res.send(req.body)
});


app.get('/locations2', function(req, res) {
	//console.log(req);
	res.send(json_var)

     
});



function initMap() {
        var request = new XMLHttpRequest();
         request.open("GET", "https://bruce-decker.github.io/mapData.json", false);
         request.send(null)
        
         var my_JSON_object = JSON.parse(request.responseText);
         $(function(){
         $.ajax({

            type: 'POST',
            url: '/locations2',
            data: request.responseText
           
           
          })
       })


        
        var options = {
          zoom: 8,
          center: {lat: 37.7749, lng:-122.4194}
        }
      
        var map = new google.maps.Map(document.getElementById('map'), options);
     

        for (var i = 0; i < my_JSON_object.locations.location.length; i++) {
         addMarker({lat: my_JSON_object.locations.location[i].latitude, lng: my_JSON_object.locations.location[i].longitude}, my_JSON_object.locations.location[i].type);
         addCircle({lat: my_JSON_object.locations.location[i].latitude, lng: my_JSON_object.locations.location[i].longitude}, my_JSON_object.locations.location[i].$revenue);
        }        
    
        function addMarker(coords, type) {
        var marker = new google.maps.Marker({
          position: coords,
          map: map
        });
            if (type == "RetailLocation") {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png')
            }
            if (type == "Call Center") {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
            }
            if (type == "HeadQuarters") {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/purple-dot.png')
            }
            if (type == "Distribution Facility") {
              marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
            }
        
        }

        function addCircle(coords, revenue) {
          var cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: coords,
            radius: revenue / 10000
          });

        }
      }