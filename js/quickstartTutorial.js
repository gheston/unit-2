// Leaflet quick start
// Gerald Heston, Geog 575-070, Lab 1-1, Feb 12, 2023


//makes a map centered on London, England, zoom level 13
var map = L.map('map').setView([51.505, -0.09], 13);

// set the base map to my Midcentury Modern basemap from Mapbox, Geog 572 project
L.tileLayer('https://api.mapbox.com/styles/v1/geraldhestonwisc/claki7gyd000114nxihcnqa4p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g', {
    maxZoom: 19,
    attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Mapbox carto style - it works!
// https://api.mapbox.com/styles/v1/geraldhestonwisc/claki7gyd000114nxihcnqa4p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g
// https://youtu.be/b6Oh4ZBKf6o

// creates a simple marker
var marker = L.marker([51.5, -0.09]).addTo(map);

// creates a simple circle
var circle = L.circle([51.508, -0.11], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

// creates a polygon (triangle)
var polygon = L.polygon([
    [51.509, -0.08],
    [51.503, -0.06],
    [51.51, -0.047]
]).addTo(map);

// add the popups
marker.bindPopup("<b>Hello World!</b><br>I am a popup.").openPopup(); // openPopup() makes the popup open when the map does
circle.bindPopup("I am a circle.");
polygon.bindPopup("I am a polygon.");

// standalone popup
var popup = L.popup()
    // .setLatLng([51.513, -0.09])
    // .setContent("I am a standalone popup.")
    // .openOn(map);

// click on the map, a popup showing long/lat comes up    
function onMapClick(e) {
    // alert("You clicked the map at " + e.latlng);
    popup
        .setLatLng(e.latlng)
        .setContent("you clicked the map at " + e.latlng.toString())
        .openOn(map);
}

// event listener for onMapClick()
map.on('click', onMapClick);
