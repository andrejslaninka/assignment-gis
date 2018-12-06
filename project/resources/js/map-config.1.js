var mymap = L.map('map').setView([49.1579, 20.0832], 12);
var geojson;
// mymap.scrollWheelZoom.disable();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiYW5keXMxNjY2IiwiYSI6ImNqb3l2MnU0aTJqcWEzdm1qaXptd3NpYnMifQ.O7la1tT2OYHAfkqWVIXgyg', {
    maxZoom: 18,
    minZoom: 7,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(mymap);

function style(feature) {
    return {
        stroke: true,
        weight: 2,
        opacity: 1,
        color:(feature.properties.color)? feature.properties.color : 'black',
    };
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',

    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

$(document).ready(function () {
    $.ajax({
        url: "/place",
        cache: false,
        success: function (data) {
            
            geojson = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).bindPopup(function (layer) {
                return layer.feature.properties.osm_id;
            }).addTo(mymap);
            
        }
    });
});




