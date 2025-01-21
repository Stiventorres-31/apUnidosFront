<?php

use App\Http\Controllers\LoginController;
use App\Http\Controllers\LogoutController;
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
    Route::put("/{numero_identificacion}", [UserController::class, 'update']);
});

