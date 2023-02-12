// GeoJSON with Leaflet
// Gerald Heston, Geog 575-070, Lab 1-1, Feb 12, 2023

// make a 2nd map (usMap) for the US
var usMap = L.map('usMap').setView([40, -100], 4);


// set the base map to my Midcentury Modern basemap from Mapbox, Geog 572 project
L.tileLayer('https://api.mapbox.com/styles/v1/geraldhestonwisc/claki7gyd000114nxihcnqa4p/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZ2VyYWxkaGVzdG9ud2lzYyIsImEiOiJja3ludzB3d3kwN2EyMndyMDN3cGh4dXkwIn0.INriYzJUUk60r1ffeQBr9g', {
    maxZoom: 19,
    attribution: '© <a href="https://www.mapbox.com/contribute/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(usMap);


// setting the popup, using onEachFeature
function onEachFeature(feature, layer) {
    // does this feature hae a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

// GeoJSON feature of Coors Field, Denver
var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-104.99404, 39.75621]

    }
};

// add the features to the map, but bind the popups at the same time from the onEachFeature function
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(usMap);


// add the point to the map and set the popup - one way of doing it
// L.geoJSON(geojsonFeature)
//     .bindPopup(function (layer) {
//         return layer.feature.properties.popupContent;
//     }).addTo(usMap);


// 2 weird lines aross the great plains
var myLines = [{
    "type": "LineString",
    "coordinates": [[-100, 40], [-105, 45], [-110, 55]]
}, {
    "type": "LineString",
    "coordinates": [[-105, 40], [-110, 45], [-115, 55]]
}];

// style for weird lines (orange)
var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

// add weird lines to the US map
L.geoJSON(myLines, {
    style: myStyle
}).addTo(usMap);

// make 2 polygons Colorado and North Dakota
var states = [{
    "type": "Feature",
    "properties": {"party": "Republican"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-104.05, 48.99],
            [-97.22,  48.98],
            [-96.58,  45.94],
            [-104.03, 45.94],
            [-104.05, 48.99]
        ]] // North Dakota
    }
}, {
    "type": "Feature",
    "properties": {"party": "Democrat"},
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-109.05, 41.00],
            [-102.06, 40.99],
            [-102.03, 36.99],
            [-109.04, 36.99],
            [-109.05, 41.00]
        ]] // Colorado
    }
    }];

// add 2 poloygons and color them based on the property 'party'    
L.geoJSON(states, {
    style: function(feature) {
        switch (feature.properties.party) {
            case 'Republican': return {color: "#ff0000"}; // red
            case 'Democrat': return {color: "#0000ff"}; // blue
        }
    }
}).addTo(usMap);

// create a point for Aces field, Reno
var someGeojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Aces Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Aces play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-119.808, 39.529]
    }
};

// style for Aces field (orange circle)
var geoJsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

// add Aces field to the map as a circle marker using the pointToLayer option
L.geoJSON(someGeojsonFeature, {
    pointToLayer:  function (feature, latlng) {
        return L.circleMarker(latlng, geoJsonMarkerOptions);
    }
}).addTo(usMap);


// it's Superbowl Sunday! go Eagles!
// create 2 point features with "show_on_map" property
var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Arrowhead Field",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-94.484, 39.049]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Lincoln Financial Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-75.167, 39.9]
    }
}];

// filter features using show_on_map property
L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(usMap);