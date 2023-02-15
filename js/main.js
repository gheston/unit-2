// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1, Activity 5, Feb 14 2023

// Example 2.3
// Map of GeoJSON data from Megacities.geojson

// declare map var in global scope
var map;

// function to initiate Leaflet map
function createMap() {
    // create the map, centered on USA
    map = L.map('map', {
        center: [39, -96],
        zoom: 4
    });

    // add my Midcentury Modern Mappbox base tile layer
    L.tileLayer('https://api.mapbox.com/styles/v1/geraldhestonwisc/claki7gyd000114nxihcnqa4p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g', {
        attribution: '&copy; <a href="https://www.mapbox.com/contribute/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // call getData function
    getData(map);
};

// function to attach popups to each mapped feature
function onEachFeature(feature, layer) {
    //no property named popupContent in Megacities; instead, create HTML string w/ all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties) {
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        //console.log(popupContent);
        layer.bindPopup(popupContent); 
        // add a tooltip with the central city name
        layer.bindTooltip(feature.properties.City)
    };
};

// function to retrieve the data and place it on the map

function getData(map) {
    // load the data
    fetch("data/metroUnemploymentPop.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            // style for brown circle
            var geoJsonMarkerOptions = {
                radius: 8,
                fillColor: "#A65E44",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };

            // create a Leaflet GeoJSON layer and add it to the  map
            L.geoJson(json, {
                onEachFeature: onEachFeature,

                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, geoJsonMarkerOptions);
                }
            }).addTo(map);
        })
};

document.addEventListener('DOMContentLoaded', createMap);




