<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
use App\Http\Controllers\MaterialeController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\TipoInmuebleController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::post('auth/login', action: LoginController::class);

Route::group(['middleware' => ['auth:api'], "prefix" => 'auth'], function () {
    Route::post('/logout', action: LogoutController::class);
});

Route::middleware('auth:api')->prefix("usuario")->group(function(){
    Route::post("/", [UserController::class, 'store']);
    Route::get("/", [UserController::class, 'index']);
    Route::get("/{numero_identificacion}", [UserController::class, 'show']);
    Route::put("/changePassword", [UserController::class, 'changePassword']);
    Route::put("/{numero_identificacion}", [UserController::class, 'update']);
});

Route::middleware('auth:api')->prefix('materiale')->group(function(){
    Route::get("/",[MaterialeController::class,"index"]);
    Route::post("/",[MaterialeController::class,"store"]);
    Route::put("/{referencia}",[MaterialeController::class,"update"]);
    Route::delete("/", [MaterialeController::class,'delete']);
});

Route::middleware('auth:api')->prefix("proyecto")->group(function(){
    Route::get("/", [ProyectoController::class,'index']);
    Route::get("/{codigo_proyecto}", [ProyectoController::class,'show']);
    Route::post("/", [ProyectoController::class,'store']);
    Route::put("/{codigo_proyecto}", [ProyectoController::class,'update']);
});

Route::middleware('auth:api')->prefix("tipo_inmueble")->group(function(){
    Route::get("/", [TipoInmuebleController::class,'index']);
    Route::get("/{id}", [TipoInmuebleController::class,'show']);
    Route::post("/", [TipoInmuebleController::class,'store']);
    Route::put("/{id}", [TipoInmuebleController::class,'update']);
});

