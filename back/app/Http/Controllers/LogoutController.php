<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class LogoutController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke()
    {
        try {
            auth('api')->logout();
            JWTAuth::invalidate(JWTAuth::getToken());
            return response()->json([
                "isError" => false,
                "code" => 200,
                "message" => "Se ha cerrado con exito",
                "result" => []
            ]);
        } catch (JWTException $ex) {
            return response()->json([
                "isError" => true,
                "code" => 401,
                "message" => "El token no existe",
                "result" => []
            ], 401);
        }
    }
}
