<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('index');
});
Route::get('/api/hiking-route/all', 'HikingRouteController@index');
Route::get('/api/hiking-route/{id}', 'HikingRouteController@show');
Route::get('/api/region/show', 'HikingRouteController@showRegion');
Route::get('/api/place/{lat}/{lng}/{radius}', 'PlaceController@placeAround');
Route::get('/api/place/viewpoint/all', 'PlaceController@viewpoints');
Route::get('/api/place/food/all', 'PlaceController@food');