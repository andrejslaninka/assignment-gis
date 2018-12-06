$(document).ready(function () {

    var geojson;
    var currentLat;
    var currentLng;

    var userLocation = null;
    var hikingRoutesLayer = null;
    var viewpointsLayer = null;
    var foodLayer = null;
    var aroundPointsLayer = null;
    var nearestPointsLayer = null;

    $(".collapse").sideNav({
        closeOnClick: false,
    });

    // map initialization
    L.mapbox.accessToken = 'pk.eyJ1IjoiYW5keXMxNjY2IiwiYSI6ImNqb3l2MnU0aTJqcWEzdm1qaXptd3NpYnMifQ.O7la1tT2OYHAfkqWVIXgyg';

    var mymap = L.mapbox.map('map').setView([49.1579, 20.0832], 12);
    L.mapbox.styleLayer('mapbox://styles/andys1666/cjp6riyvk2xqv2sk5p04tn75t').addTo(mymap);

    // context menu
    mymap.on("contextmenu", function (e) {
        mymap.flyTo([e.latlng.lat, e.latlng.lng], 18);
        var tdiv = '<a href="#" id="set-location" class="btn btn-floating pulse btn-add-location" data-lat="' + e.latlng.lat + '" data-lng="' + e.latlng.lng + '"><i class="material-icons">add_location</i></a>';
        var tpopup = L.popup({ closeButton: false })
            .setLatLng(e.latlng)
            .setContent(tdiv)
            .openOn(mymap);
    });

    function routeStyle(feature) {
        return {
            stroke: true,
            weight: 2,
            opacity: .7,
            color: (feature.properties.color) ? feature.properties.color : 'black',
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 4,
            opacity: 1
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        hikingRoutesLayer.resetStyle(e.target);
    }


    // logika

    $('#map').on('click', '#set-location', function (e) {
        if (userLocation !== null)
            mymap.removeLayer(userLocation);
        if (nearestPointsLayer !== null) {
            mymap.removeLayer(nearestPointsLayer);
            $('#nearest-points').prop('checked', false);
        }

        currentLat = e.currentTarget.getAttribute('data-lat');
        currentLng = e.currentTarget.getAttribute('data-lng');
        Materialize.toast('Polohu bola nastavená.', 2000);
        $('#current-location').text(Math.round(currentLat * 1000) / 1000 + ', ' + Math.round(currentLng * 1000) / 1000);
        userLocation = L.marker([currentLat, currentLng], {
            icon: L.mapbox.marker.icon({
                'marker-size': 'small',
                'marker-color': '#ff9110'
            })
        }).bindTooltip(function () {
            return 'Vaša poloha';
        });
        mymap.addLayer(userLocation);

        $.ajax({
            url: "/api/place/" + currentLat + "/" + currentLng + "/" + 1000,
            cache: false,
            success: function (data) {
                $('#list-items').text('');
                nearestPointsLayer = L.geoJson(data)
                .bindTooltip(function(layer) {
                    return layer.feature.properties.name + ' | Vzdialenosť: ' + Math.round(layer.feature.properties.distance * 100) / 100 + ' m';
                });
                

                data.forEach(item => {
                    $('#list-items').append(`
                    <li class="collection-item avatar">
                    <i class="material-icons circle green">place</i>
                    <span class="title">`+ item.properties.name +`</span>
                    <p>Vzdialenosť: ` + Math.round(item.properties.distance * 100) / 100 + `</p>
                </li>`);
                    
                });
                
                mymap.addLayer(nearestPointsLayer);
                mymap.flyTo([currentLat, currentLng], 15);
                $('#nearest-points').prop('checked', true);
            }
        });

    });


    function pointsAround(e) {

        if (aroundPointsLayer !== null)
            mymap.removeLayer(aroundPointsLayer);

        mymap.fitBounds(e.target.getBounds());

        $.ajax({
            url: "/api/hiking-route/" + e.target.feature.properties.osm_id,
            cache: false,
            success: function (data) {
                aroundPointsLayer = L.geoJson(data, {
                    pointToLayer: function (feature, latlng) {
                        return L.circleMarker(latlng);
                    },
                    onEachFeature: function(feature, layer) {
                        layer.on({
                            click: function(e) {
                                mymap.flyTo([e.latlng.lat, e.latlng.lng], 17);
                            }
                        });
                    }
                }).bindTooltip(function (layer) {
                    return ((layer.feature.properties.name!=null)? layer.feature.properties.name: '');
                });
                mymap.addLayer(aroundPointsLayer);
            }
        });
    }

    // show all hiking routes
    $.ajax({
        url: "/api/hiking-route/all",
        cache: false,
        success: function (data) {

            hikingRoutesLayer = L.geoJson(data, {
                style: routeStyle,
                onEachFeature: function(feature, layer) {
                    layer.on({
                        mouseover: highlightFeature,
                        mouseout: resetHighlight,
                        click: pointsAround
                    });
                }
            });
        }
    });

    // show all viewpoints
    $.ajax({
        url: "/api/place/viewpoint/all",
        cache: false,
        success: function (data) {

            viewpointsLayer = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.mapbox.marker.icon({
                            'marker-size': 'large',
                            'marker-symbol': 'park2',
                            'marker-color': '#b12aa9'
                        })
                    });
                },
                onEachFeature: function(feature, layer) {
                    layer.on({
                        click: function(e) {
                            mymap.flyTo([e.latlng.lat, e.latlng.lng], 17);
                        }
                    });
                }
            }).bindTooltip(function (layer) {
                return layer.feature.properties.place_type + ' ' + ((layer.feature.properties.name!=null)? layer.feature.properties.name: '');
            })
        }
    });

    //show all restaurants
    $.ajax({
        url: "/api/place/food/all",
        cache: false,
        success: function (data) {

            foodLayer = L.geoJson(data, {
                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng, {
                        icon: L.mapbox.marker.icon({
                            'marker-size': 'large',
                            'marker-symbol': 'restaurant',
                            'marker-color': '#e12140'
                        })
                    });
                },
                onEachFeature: function(feature, layer) {
                    layer.on({
                        click: function(e) {
                            mymap.flyTo([e.latlng.lat, e.latlng.lng], 16);
                        }
                    });
                }
            })
            .bindTooltip(function(layer) {
                return layer.feature.properties.name;
            });
        }
    });


    // focus on input zoom-0
    $('#zoom-0').click('click', function () {
        mymap.flyTo([49.2043, 19.9708], 11);
    });

    // toggle hiking routes
    $('#hiking-routes').click(function () {
        if ($('#hiking-routes').is(':checked')) {
            mymap.addLayer(hikingRoutesLayer);
        }
        else {
            mymap.removeLayer(hikingRoutesLayer);
            if (aroundPointsLayer!=null)
                mymap.removeLayer(aroundPointsLayer);
        }
    });

    // toggle viewpoints
    $('#viewpoints').click(function () {
        if ($('#viewpoints').is(':checked')) 
            mymap.addLayer(viewpointsLayer);
        else 
            mymap.removeLayer(viewpointsLayer);
    });

    // toggle food
    $('#food').click(function () {
        if ($('#food').is(':checked')) 
            mymap.addLayer(foodLayer);
        else 
            mymap.removeLayer(foodLayer);
    });

    // toggle nearest-points
    $('#nearest-points').click(function () {
        if (currentLat != null && currentLng != null) {
            if ($('#nearest-points').is(':checked')) 
                mymap.addLayer(nearestPointsLayer);
            else 
                mymap.removeLayer(nearestPointsLayer);
        }
        else {
            Materialize.toast('Najskôr zvoľte vašu polohu.', 2000);
            $('#nearest-points').prop('checked', false);
        }
    });

});




