<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    
    <link href='https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.css' rel='stylesheet' />
    <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/MarkerCluster.css' rel='stylesheet' />
    <link href='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/MarkerCluster.Default.css' rel='stylesheet' />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css">
    <link rel="stylesheet" media="all" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    <link rel="stylesheet" href="{{ asset('css/style.css') }}"/>
    <title>Mapa</title>
</head>
<body>
    <form id="search-form">
        <nav class="search-filter" id="layer-filter">
            <div class="nav-wrapper filter-option">
                <ul>
                    <li id="zoom-0"><i class="material-icons left">zoom_out</i> oddialiť</li>
                    <li><input type="checkbox" name="hiking-routes" id="hiking-routes" value="1" /><label for="hiking-routes">Turistické trasy</label></li>
                    <li><input type="checkbox" name="viewpoints" id="viewpoints" value="1" /><label for="viewpoints">Výhľady</label></li>
                    <li><input type="checkbox" name="food" id="food" value="1" /><label for="food">Jedlo</label></li>
                    <li><input type="checkbox" name="nearest-points" id="nearest-points" value="1" /><label for="nearest-points">Miesta v okolí</label></li>
                    <li><a href="#" data-activates="slide-out" class="collapse"><i class="material-icons">menu</i></a></li>
                </ul>
            </div>
        </nav>
    </form>
    <ul id="slide-out" class="side-nav">
        <div class="user-view">
          <div class="background">
            <img src="img/side-nav.png">
          </div>
          <span class="black-text name">Zoznam miest v okolí</span>
          <span class="black-text email">Poloha: <span id="current-location">nie je nastavená</span></span>
        </div>
        <li><a class="subheader">Zoznam miest</a></li>
        <ul class="collection" id="list-items"></ul>
      </ul>
    <div id="map"></div>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js"></script>
    <script src='https://api.mapbox.com/mapbox.js/v3.1.1/mapbox.js'></script>
    <script src='https://api.mapbox.com/mapbox.js/plugins/leaflet-markercluster/v1.0.0/leaflet.markercluster.js'></script>
    <script src="{{ asset('js/map-config.js') }}"></script>
    
</body>
</html>