<?php

namespace App\Http\Controllers;
use DB;
use Illuminate\Http\Request;

class HikingRouteController extends Controller
{
    function index() {
        $data = DB::select(DB::raw("SELECT ST_AsGeoJSON(geom)::json as geometry, name, operator, color, id FROM planet_osm_line WHERE route='hiking'"));
        
        foreach ($data as $key => $value) {
            $newFeature = array(
                'type' => 'Feature',
                'geometry' => json_decode($value->geometry),
                'properties' => array(
                    'osm_id' => $value->id,
                    'name' => $value->name,
                    'operator' => $value->operator,
                    'color' => $value->color
                )
            );
            $geojson[] = $newFeature;
            
        }
        return $geojson;
    }

    function show($id) {
        $substep = DB::select(DB::raw("SELECT geom FROM planet_osm_line WHERE route='hiking' and id=? limit 1"), [$id]);
        $data = DB::select(DB::raw("SELECT ST_AsGeoJSON(p.geom)::json as geometry, p.name from planet_osm_point p where ST_DWithin(?, p.geom::geography, 5) and p.name is not null limit 50;"),[$substep[0]->geom]);

        foreach ($data as $key => $value) {
            $newFeature = array(
                'type' => 'Feature',
                'geometry' => json_decode($value->geometry),
                'properties' => array(
                    'name' => $value->name
                )
            );
            $geojson[] = $newFeature;
            
        }
        return $geojson;
    }

    // function showRegion() {
    //     return DB::select(DB::raw("SELECT ST_AsGeoJSON(ST_MakePolygon(ST_LineMerge((select ST_Union(way) from planet_osm_line where osm_id=38321675))))::json as geometry"));
    // }
}
