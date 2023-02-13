// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1-2, Feb 12 2023

// Example 2.3
// Map of GeoJSON data from Megacities.geojson

// declare map var in global scope
var map;

// function to initiate Leaflet map
function createMap() {
    // create the map
    map = L.map('map', {
        center: [20, 0],
        zoom: 2
    });

    // add OSM base tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"><OpenStreetMap Contributors</a>'
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
    };
};

// function to retrieve the data and place it on the map

function getData(map) {
    // load the data
    fetch("data/MegaCities.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {

            // style for orange circle
            var geoJsonMarkerOptions = {
                radius: 8,
                fillColor: "#ff7800",
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


