// for code blocks that don't work but maybe I'll fix them later


// onEachFeature to bind the metro area boundary tooltip
function onEachFeature(feature, layer) {
    var tooltipContent = feature.properties.NAME;

    if (feature.properties) {
        layer.bindTooltip(tooltipContent);
    };
};

//build an attributes array from the boundary data
function processMetroAreaBoundaryData(data) {
    //empty array to hold attributes
    var attributes = [];

    //properties of the 1st feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties) {
        attributes.push(attribute);
    };

    //check result
    console.log(attributes);

    return attributes;
};

L.geoJSON(json, {
    onEachFeature: onEachFeature
   }).addTo(map); 

//            var metroAreaBoundaryAttributes = processMetroAreaBoundaryData(json);
    //var metroAreaBoundaryLayer = {};
//        var metroAreaPoints = {};

var overlayMaps = {
    "Metro Area": metroAreaPoints,
    "Metro Area Boundaries" : metroAreaBoundaryLayer
};


//loop to add each circle and text to svg string
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
                svg += '<text id="' + circles[i] + '-text" x="65" y="' + textY + '">' + circles[i] + ": " + yearlyStats[yearStatsIndex][circles[i]] + ' %' + '</text>';
            };

            //close svg string
            svg += "</svg>";