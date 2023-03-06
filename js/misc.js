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
