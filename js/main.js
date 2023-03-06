// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1, Feb 28 2023

// declare map var in global scope
var map;
// declare an object to hold statistics for the entire dataset
var dataStats = {};

// declare an array to hold statistics for each year
var yearlyStats = [];

// basemap - Midcentury Modern
var mcmBasemap = L.tileLayer('https://api.mapbox.com/styles/v1/geraldhestonwisc/claki7gyd000114nxihcnqa4p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g', {
    attribution: '&copy; <a href="https://www.mapbox.com/contribute/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'});

// basemap - monochhrome blue
var blueBasemap = L.tileLayer('https://api.mapbox.com/styles/v1/geraldhestonwisc/clevpwcbs000w01l49qtm5sk0/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g', {
    attribution: '&copy; <a href="https://www.mapbox.com/contribute/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' });    

// list of basemaps for the legend control
    var baseMaps  = {
    "Midcentury Modern Basemap": mcmBasemap,
    "Monochrome Blue Basemap": blueBasemap
};




// function to initiate Leaflet map
function createMap() {
    // create the map, centered on USA
    map = L.map('map', {
        center: [39, -96],
        zoom: 4,
        minZoom: 4,
        maxZoom: 7 // limit the zoom levels to something appropriate for this dataset, where the basemap shows the city names
    });

    // add my Midcentury Modern Mapbox base tile layer
    blueBasemap.addTo(map);

    // call getData function
    getData();
};

function calcStats(data) {
    //create empty array to store all data values
    var allValues = [];


    //loop thru each city
    for (var city of data.features) {

        // loop thru each year
        for (var year = 2016; year <= 2022; year += 1) {
            //get unempolyment rate for current year
            var value = Number(city.properties["Rate_" + String(year)]); // had to add the Number() - to make sure it was reading them all as numbers and not strings - 
            //console.log(value);
            
            // add value to array
            if (value) { //some of my data entries are null, which are "falsy". then the minValue becomes 0, which is a problem in the Flannery equation because it's dividing by the MinValue (0). This test only passes the truthy (non-null) values into the array.
                // removed the data rows with null values so  I wouldn't have to deal with them.
                allValues.push(value);
            }
        }
    }

    //    console.log(allValues);
    // get min, max stats for our array
    dataStats.min = Math.min(...allValues);
    dataStats.max = Math.max(...allValues);
    // calculate mean value
    var sum = allValues.reduce((a, b) =>  a + b);
    //console.log("sum: ", sum);
    dataStats.mean = Math.round(sum / allValues.length * 10) / 10; //rounds to 1 decimal place
    // console.log("max: ", dataStats.max);
    // console.log("mean: ", dataStats.mean);
    // console.log("min: ", dataStats.min);
};

// function to calculate statistics for eah year of data
function calcYearlyStats(data) {
    //empty array for yearly values
    var yearlyValues = [];

    // this for/for loop is inverted from calcStats() so it only runs for the 7 columns
    for (var year = 2016; year <= 2022; year += 1) {
        for (var city of data.features) {
            var value = Number(city.properties["Rate_" + String(year)]);
            yearlyValues.push(value);
        }
        
        //calculates the statistics
        var yearlyMin = Math.min(...yearlyValues);
        var yearlyMax = Math.max(...yearlyValues);
        var yearlyMean = yearlyValues.reduce((a, b) => a + b) / yearlyValues.length;

        //emtpy temp object that will get populated and appended to the yearlyValues[]
        var oneYearStats = {};

        // creates the object with statistics
        //this is probably reduntant, could be combined with steps above
        oneYearStats.year = year;
        oneYearStats.min = yearlyMin;
        oneYearStats.max = yearlyMax;
        oneYearStats.mean = Math.round(yearlyMean * 10) / 10;

        //adds the one-year object to the yearlyStats[] array
        yearlyStats.push(oneYearStats);
        
        //empties out the array to start the loop over fresh
        yearlyValues = [];
    }

    // prints the yearlyStats[] to the console
    // for (var i = 0; i < yearlyStats.length;  i++) {
    //     console.log(yearlyStats[i]);
    // }

};

// calculate the radius of each proportional symbold
function calcPropRadius(attValue) {
    // constant factor adjusts symbol sizes evenly - 7 looked the best at a national scale
    var minRadius = 7;
    //Flannery appearance compensation formula
    var radius = 1.0083 * Math.pow(attValue / dataStats.min, 0.5715) * minRadius;

    //console.log(radius);

    return radius;
}



//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes) {
    // mapping average unemployment rate for each year
    //console.log(attributes);
    
    var attribute = attributes[0];
    //console.log(attribute);

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
    var popupContent =  new PopupContent(feature.properties, attribute);

    //bind the popup to the circle marker
    layer.bindPopup(popupContent.formatted, {
        offset: new L.Point(0, -geoJsonMarkerOptions.radius)
    });

    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

function createPropSymbols(data, attributes) {
    // create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
         pointToLayer: function (feature, latlng) {
            return pointToLayer(feature, latlng, attributes);
        }
     }).addTo(map);
};

// secton 1-3-2 custom leaflet control version of createSequenceControls()
function createSequenceControls(attributes) {
    var SequenceControl = L.Control.extend({
        options: {
            position: 'bottomleft'
        },

        onAdd: function () {
            // create the control container div with a particular class  name
            var container = L.DomUtil.create('div', 'sequence-control-container');

            // initialize other DOM elements
            //create range input element (slider)
            container.insertAdjacentHTML('beforeend', "<input class='range-slider' type='range'></input>");

            // add step buttons
            container.insertAdjacentHTML('beforeend', '<button class="step" id="reverse" title="Reverse"><i class="fa-solid fa-backward"></i></button>');
            container.insertAdjacentHTML('beforeend', '<button class="step" id="forward" title="Forward"><i class="fa-solid fa-forward"></i> </button>');

            // disable any mouse event listeners for the container
            L.DomEvent.disableClickPropagation(container);

            return container;
        } // no semicolon!
    });

    map.addControl(new SequenceControl()); //add listeners after adding control

            // Step 5 click listener for buttons

            // //set slider attributes
            document.querySelector(".range-slider").max = 6; // total ranges 7, 2016 to 2022
            document.querySelector(".range-slider").min = 0; // first range index
            document.querySelector(".range-slider").value = 0;
            document.querySelector(".range-slider").step = 1;

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
                //console.log(index);

                // step 9 pass new attribute to update symbols
                updatePropSymbols(attributes[index]);
            });
};

// resize proportional symbols according to new attribute values
function updatePropSymbols(attribute) {
    map.eachLayer(function (layer) {
        if (layer.feature && layer.feature.properties[attribute]) {
            //update layer style and popup
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            var popupContent = new PopupContent(props, attribute);

            //update popup content
            popup = layer.getPopup();
            popup.setContent(popupContent.formatted).update();

        };
    });

    // update the legend with the year displayed on the map
    var year = attribute.split("_")[1];
    
    // get the index for the currently dipslayed year from yearlyStats[]
    var yearStatsIndex = findYearlyStats(year);

    // replace the year and stats in the legend with those for the currently displayed year    
    document.querySelector("span.year").innerHTML = year;
    document.querySelector("span.min").innerHTML = yearlyStats[yearStatsIndex].min;
    document.querySelector("span.mean").innerHTML = yearlyStats[yearStatsIndex].mean;
    document.querySelector("span.max").innerHTML = yearlyStats[yearStatsIndex].max;

    //document.querySelector("circle#id").innerHTML = 
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
    //console.log(attributes);

    return attributes;
};




// function to retrieve the data and place it on the map
function getData() {

    // style for metro Area boundaries
    var metroAreaBoundaryStyle = {
        fillColor: "#A65E44",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.2
    };

    // load the Metro Area bountdary data
    fetch("data/MetroAreaBoundaries_Simp.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            L.geoJSON(json, metroAreaBoundaryStyle).addTo(map);
        });

    // load the Metro Area unemployment data
    fetch("data/metroUnemploymentPop5.geojson")
        .then(function (response) {
            return response.json();
        })
        .then(function (json) {
            //create an attribute array - names of attributes
            var attributes = processData(json);
            // calculate the minimum value
            calcStats(json);

            // calculate the yearly stats
            calcYearlyStats(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            //call function to create the proportional symbols
            createSequenceControls(attributes);
            // call function to create the legend with text for the 1st year, 2016
            createLegend(attributes[0]);


        });

    // add a layer control to the map
    L.control.layers(baseMaps).addTo(map);

};


// function to create a PopupContent class
function PopupContent(properties, attribute) {
    this.properties = properties;
    this.attribute = attribute;
    this.year = attribute.split("_")[1];
    this.unemploymentRate = this.properties[attribute];
    this.formatted = "<p><b>" + this.properties.MetropolitanArea + "</b></p><p>Average Unemployment Rate in <b>" + this.year + ":</b><h4>" + this.unemploymentRate + "%</h4></p>";
};

//function to create a Legend with text and proportional symbols
function createLegend(attributes){
    var LegendControl = L.Control.extend({
        options: {
            position: 'bottomright'
        },

        onAdd: function () {
            //create the control container with a particular class name
            var container = L.DomUtil.create('div', 'legend-control-container');

            //start with the first year
            var year = attributes.split("_")[1];

            // get the index of the currently year in the yearlyStats
            var yearStatsIndex = findYearlyStats(year);

            //insert text "Average Unemployment Rate in *Year*"
            //            "Min: x% - Mean: x% - Max: x%" - stats for the currently displayed year, to keep them separate from the 
            //                  symbol legend which displays stats for the entire time range
            container.innerHTML = '<p class="temporal legend">Average Unemployment Rate in <span class="year">' + year + '</span></p>' + '<p>Min: <span class="min">' + yearlyStats[yearStatsIndex].min + '</span>% - Mean: <span class="mean">' + yearlyStats[yearStatsIndex].mean + '</span> % - Max: <span class="max">' + yearlyStats[yearStatsIndex].max + '</span>%</p>' + '<p>---</p><p>Ranges over time period:' ;

            // start the svg element 
            var svg = '<svg id="attribute legend" width="160px" height="60px">';
            
            //array of circle names to base loop on
            var circles = ["max", "mean", "min"];

            // loop to add each circle and text to svg string
            for (var i=0; i<circles.length; i++) {
                
                // assign the r and cy attributes
                //var radius = calcPropRadius(dataStats[circles[i]]);
                var radius = calcPropRadius(yearlyStats[yearStatsIndex][circles[i]]);
                var cy = 50 - radius;
                
                //circle string
                svg += '<circle class="legend-circle" id="' + circles[i] + '" r="' + radius + '"cy="' + cy + '" fill="#a65e44" fill-opacity="0.8" stroke="#fff" cx="30"/>';

                // evenly space out labels
                var textY = i * 15 + 20;

                // text string; i didn't want the min/max/mean, just the numbers
                svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">'  + yearlyStats[yearStatsIndex][circles[i]] + ' %' + '</text>';
            };
            
            //close svg string
            svg += "</svg>";
            
            //add attribute legend svg to container
            container.insertAdjacentHTML('beforeend', svg);

            return container;
        }
    });

    map.addControl(new LegendControl());
};


//function to find the index in yearlyStats for the currently displayed year
function findYearlyStats(year4Stats) {

    var index = yearlyStats.findIndex(year1 => year1.year == year4Stats);

    return index;
    
}





document.addEventListener('DOMContentLoaded', createMap);




