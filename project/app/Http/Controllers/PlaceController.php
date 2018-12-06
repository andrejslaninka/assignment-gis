<?php

namespace App\Http\Controllers;

use DB;
use Illuminate\Http\Request;

class PlaceController extends Controller
{

    function placeAround($long, $lat, $radius) {
        $data = DB::select(DB::raw("
        SELECT ST_AsGeoJSON(geom)::json as geometry, name, building, ST_Distance(geom::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, true) as distance FROM planet_osm_point WHERE ST_DWithin(geom::geography, ST_SetSRID(ST_MakePoint(?, ?), 4326)::geography, ?)=true AND name IS NOT NULL ORDER BY distance ASC LIMIT 50;"), [$lat, $long, $lat, $long, $radius]);

        foreach ($data as $key => $value) {
            $newFeature = array(
                'type' => 'Feature',
                'geometry' => json_decode($value->geometry),
                'properties' => array(
                    'building' => $value->building,
                    'name' => $value->name,
                    'distance' => $value->distance
                )
            );
            $geojson[] = $newFeature;

        }
        return $geojson;
    }

    function viewpoints() {
        $data = DB::select(DB::raw("select ST_AsGeoJSON(geom)::json as geometry, name, ele from planet_osm_point where tourism='viewpoint';"));
    
        foreach ($data as $key => $value) {
            $newFeature = array(
                'type' => 'Feature',
                'geometry' => json_decode($value->geometry),
                'properties' => array(
                    'place_type' => 'Vyhliadka',
                    'name' => $value->name,
                    'ela' => $value->ele
                )
            );
            $geojson[] = $newFeature;

        }
        return $geojson;
    }

    function food() {
        $data = DB::select(DB::raw("select ST_AsGeoJSON(geom)::json as geometry, name from planet_osm_point where amenity='restaurant';"));
    
        foreach ($data as $key => $value) {
            $newFeature = array(
                'type' => 'Feature',
                'geometry' => json_decode($value->geometry),
                'properties' => array(
                    'place_type' => 'Jedlo',
                    'name' => $value->name
                )
            );
            $geojson[] = $newFeature;

        }
        return $geojson;
    }
}
