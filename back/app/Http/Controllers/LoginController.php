<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Facades\JWTAuth;

class LoginController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $credenciales = $request->only("numero_identificacion", "password");

        if (!$token = JWTAuth::attempt($credenciales)) {
            return response()->json(['error' => 'Unauthorized'], status: 401);
        }

        // $usuario = Auth::user();
        // $customClaims = [
        //     'user_id' => $usuario->id,
        //     'nombre_completo' => $usuario->role,
            
          
        // ];

        // $token = JWTAuth::claims($customClaims)->attempt($credenciales);
        

        return response()->json([
            'token' => $token
        ]);
        //
    }
}
