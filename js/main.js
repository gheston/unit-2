// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1, Activity 6, Feb 21 2023

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
            if (value) { //some of my data entries are null, which are "falsy". then the minValue becomes 0, which is a problem in the Flannery equation because it's dividing by the MinValue (0). This test only passes the truthy (non-null) values into the array.
                // removed the data rows with null values so  I wouldn't have to deal with them.
                allValues.push(value);
            }
        }
    }

    //    console.log(allValues);
    // get minimum value of our array
    var minValue = Math.min(...allValues);

    //console.log("minValue: ", minValue);
    return minValue;

};

// calculate the radius of each proportional symbold
function calcPropRadius(attValue) {
    // constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery appearance compensation formula
    var radius = 1.0083 * Math.pow(attValue / minValue, 0.5715) * minRadius;

    //console.log(radius);

    return radius;
}

// // function to attach popups to each mapped feature
// function onEachFeature(feature, layer) {
//     //no property named popupContent in Megacities; instead, create HTML string w/ all properties
//     var popupContent = "";
//     if (feature.properties) {
//         //loop to add feature property names and values to html string
//         for (var property in feature.properties) {
//             popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
//         }
//         //console.log(popupContent);
//         layer.bindPopup(popupContent); 
//         // add a tooltip with the central city name
//         layer.bindTooltip(feature.properties.City)
//     };
// };

// Step 3
// function to add circle markers for point features to the map


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes) {
    // mapping average unemployment rate for 2021
    var attribute = attributes[0];
    console.log(attribute);

    // style for brown circle
    var geoJsonMarkerOptions = {
        radius: 8,
        fillColor: "#A65E44",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //step 5, for each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    //console.log(attValue);

    // step 6, give each feature's circle marker a radius based on its attribute value
    geoJsonMarkerOptions.radius = calcPropRadius(attValue);
    //console.log(geoJsonMarkerOptions.radius);

    //create circle marker layer
    var layer = L.circleMarker(latlng, geoJsonMarkerOptions);

    //build popup content string
    var popupContent = "<p><b>Metro Area:</b> " + feature.properties.MetropolitanArea + "</p>";

    var year = attribute.split('_')[1];

    popupContent += "<p><b>Average unemployment rate in " + year + ":</b> " + feature.properties[attribute] + "%</p>";
    //console.log(popupContent);

    //bind the popup to the circle marker
    layer.bindPopup(popupContent, {
        offset: new L.Point(0, -geoJsonMarkerOptions.radius)
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;

};

function createPropSymbols(data, attributes) {
    // create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {

        //onEachFeature: onEachFeature, // moved this line into the createPropSymbols() function

        pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
        //create circle markers
        //   return L.circleMarker(latlng, geoJsonMarkerOptions); 

    }).addTo(map);
};

// create new sequence controls
function createSequenceControls(attributes) {
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend', slider);

    //set slider attributes
    document.querySelector(".range-slider").max = 4; // total ranges 5, 2017 to 2021
    document.querySelector(".range-slider").min = 0; // first range index
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;

    // add step buttons
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="reverse"></button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend', '<button class="step" id="forward"></button>');

    // replace button content with images
    document.querySelector('#reverse').insertAdjacentHTML('beforeend', '<i class="fa-solid fa-backward"></i>');
    document.querySelector('#forward').insertAdjacentHTML('beforeend', '<i class="fa-solid fa-forward"></i>');

    // Step 5 click listener for buttons
    document.querySelectorAll('.step').forEach(function (step) {
        step.addEventListener("click", function () {
            var index = document.querySelector('.range-slider').value;

            //Step 6 increment or decrement depending on button clicked
            if (step.id == 'forward') {
                index++;
                //step 7: if past the last attribute, wrap around to first attribute
                index = index > 6 ? 0 : index;

            } else if (step.id == 'reverse') {
                index--;
                //step 7: if past the first attribute, wrap around to the last attribute
                index < 0 ? 6 : index;
            };

            // step 8: update slider
            document.querySelector('.range-slider').value = index;

            // step 9 pass new attribute to update symbols
            updatePropSymbols(attributes[index]);
        })
    });

    // Step 5 input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function () {
        // get the new index value
        var index = this.value;
        console.log(index);

        // step 9 pass new attribute to update symbols
        updatePropSymbols(attributes[index]);
    });
};

// step 10 resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {
    map.eachLayer(function (layer) {
        if (layer.feature && layer.feature.properties[attribute]) {
            //update layer style and popup
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            // add city to popup content string
            var popupContent = "<p><b>Metropolitan Area:</b> " + props.MetropolitanArea + "</p>";

            // add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>Unemployment Rate in " + year + ":</b> " + props[attribute] + "%</p>";

            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent).update();

        };
    });
};

//build an attributes array from the data
function processData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the 1st feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties) {
        //only take attributes with population values
        if (attribute.indexOf("Rate") > -1) {
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

// function to retrieve the data and place it on the map
//step 2
function getData(map) {
    // load the data
    fetch("data/metroUnemploymentPop4.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            //create an attribute array
            var attributes = processData(json);
            // calculate the minimum value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            //call function to create the proportional symbols
            createSequenceControls(attributes);
        })
};

document.addEventListener('DOMContentLoaded', createMap);




