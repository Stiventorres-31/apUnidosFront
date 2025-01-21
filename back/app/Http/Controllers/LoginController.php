<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $credenciales = $request->only("numero_identificacion", "password");

        try {
            if (!$token = JWTAuth::attempt($credenciales)) {
                return response()->json([
                    "isError" => true,
                    "code" => 401,
                    "message" => "Las credenciales no son correctas",
                    "result" => []
                ], status: 401);
            }

           
        } catch (JWTException  $e) {
            return response()->json([
                "isError" => true,
                "code" => 422,
                "message" => "No se ha podido iniciar sesion",
                "result" => []
            ], status: 422);
        }
        return response()->json([
            "isError" => false,
            "message" => "Se ha iniciado sesión con exito",
            "code" => 200,
            "result" => [
                'token' => $token
            ]
        ]);
        //
    }
}
