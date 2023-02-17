// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1, Activity 5, Feb 14 2023

// Example 2.3
// Map of GeoJSON data from Megacities.geojson

// declare map var in global scope
var map;
var minValue;

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
    getData();
};

function calculateMinValue(data) {
    //create empty array to store all data values
    var allValues = [];
    //loop thru each city
    for (var city of data.features) {

        // loop thru each year
        for (var year = 2017; year <= 2021; year += 1) {
            //get unempolyment rate for current year
            var value = city.properties["Rate_" + String(year)];
            //console.log(value);
            // add value to array
            if (value) { //some of my data entries are empty, which are "falsy". then the minValue becomes 0, which is a problem in the Flannery equation because it's dividing by the MinValue (0). This test only passes the truthy values into the array.
            allValues.push(value);
            }
        }
    }
    
    console.log(allValues);
    // get minimum value of our array
    var minValue = Math.min(...allValues);
    
    console.log("minValue: ", minValue);
    return minValue;
    
};

// calculate the radius of each proportional symbold
function calcPropRadius(attValue) {
    // constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery appearance compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue, 0.5715) * minRadius;

    console.log(radius);

    return radius;
}

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

// Step 3
// function to add circle markers for point features to the map

function createPropSymbols(data){
             
            // mapping average unemployment rate for 2021
              var attribute = "Rate_2021"

              // style for brown circle
              var geoJsonMarkerOptions = {
                radius: 8,
                fillColor: "#A65E44",
                color: "#fff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };  

            // create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(data, {
                
                onEachFeature: onEachFeature, // moved this line into the createPropSymbols() function

                pointToLayer: function(feature, latlng) {

                    //step 5, for each feature, determine its value for the selected attribute
                    var attValue = Number(feature.properties[attribute]);

                    // step 6, give each feature's circle marker a radius based on its attribute value
                    geoJsonMarkerOptions.radius = calcPropRadius(attValue);

                    // examine the attribute value to check that it is correct
                    // console.log(feature.properties, attValue);

                    //create circle markers
                    return L.circleMarker(latlng, geoJsonMarkerOptions); 
                }
            }).addTo(map);
};

// function to retrieve the data and place it on the map
//step 2
function getData() {
    // load the data
    fetch("data/metroUnemploymentPop.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function(json) {
            // calculate the minimum value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json);
 
        })
};

document.addEventListener('DOMContentLoaded', createMap);




