// Store our API endpoint inside queryUrl. This will pull earthquake data from last 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Create a map object

var myMap = L.map("mapid", {
    center: [37.09, -95.71],
    zoom: 4,
    preferCanvas: true
  });
  
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

// This function will return the hex color for our circle depending on the size of the earthquake

function plotcolor(earthquakesize) {
  switch (true) {
      case earthquakesize > 5:
          return "#581845";
      case earthquakesize > 4:
          return "#900C3F";
      case earthquakesize > 3:
          return "#C70039";
      case earthquakesize > 2:
          return "#FF5733";
      case earthquakesize > 1:
          return "#FFC300";
      default:
          return "#DAF7A6";
      }
}
// This function will determine the size of each circle

function markerSize(earthquakesize) {
  if (earthquakesize = 0) {
    return 1;
  }
  return earthquakesize * 30000;
}

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {

  // loop through each earthquake

  for (var i = 0; i < data.features.length; i++) {
      
      // save the magnitude of each quake
      earthquakesize=data.features[i].properties.mag
      earthquakesize= +earthquakesize

      // save the coordinates of each quake and convert them to numbers
      cords= data.features[i].geometry.coordinates

      cords[0] = +cords[0];
      cords[1] = +cords[1];
      cords[2] = +cords[2];

      // Determine the size of the circle

      marker = markerSize(earthquakesize)
      marker = +marker

      // plot the circle
      var circle = L.circle([cords[1], cords[0], cords[2]], {
          fillOpacity: 0.75,
          color:  plotcolor(earthquakesize),
          radius: marker
         })

      // Add Info For when someone clicks on a circle   
      circle.bindPopup(
          "<h3>" + "Earthquake Location: " + data.features[i].properties.place +
          "</h3><hr><p>" + "Occured: " + new Date(data.features[i].properties.time) + "</p>" +
          "</h3><br><p>" + "Earthquake Magnitude: " + earthquakesize + "</p>" 
             ).addTo(myMap);
             
  }
});
// Add legend to our map

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        magnitude = [0,1,2,3,4,5]

        div.innerHTML +=
            '<i style="background:' + plotcolor(magnitude[0] + 1) + '"></i> ' +
           "< " + magnitude[0] + (magnitude[0 + 1]  ? '&ndash;' + magnitude[0 + 1] + '<br>' : '+')

    for (var i = 1; i < magnitude.length; i++) {
        div.innerHTML +=
            '<i style="background:' + plotcolor(magnitude[i] + 1) + '"></i> ' +
            magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);
