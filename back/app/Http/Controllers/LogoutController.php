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
    public function __invoke(Request $request)
    {
        try {
            auth('api')->logout();
            JWTAuth::invalidate(JWTAuth::getToken());
           return response()->json(['message'=>'Successfully logged out']);
           
        } catch (JWTException $ex) {
            return response()->json(['message'=>'Token not found'], 401);
           
        }
    }
}
