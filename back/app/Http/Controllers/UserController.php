<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $user = User::with("materiale")->get();

        return response()->json($user);
    }

    public function save(Request $request)
    {
        $request->validate([
            'numero_identificacion' => 'required|unique:usuarios|max:20',
            'nombre_completo' => 'required|max:50',
            'password' => 'required|min:6',
            'rol_usuario' => 'required|max:20'
        ]);
        $usuario = new User();
        $usuario->numero_identificacion = $request->numero_identificacion;
        $usuario->nombre_completo = strtoupper($request->nombre_completo);
        $usuario->password = bcrypt($request->password);
        $usuario->rol_usuario = strtoupper($request->rol_usuario);
        $usuario->estado = 'A';

        $usuario->save();

        return response()->json([
            'success' => true,
            'message' => 'Usuario creado exitosamente.',
            'user' => $usuario,
        ], 201);
    }

    public function edit(Request $request, $numero_identificacion)
    {
        $request->validate([
            'nombre_completo' => 'required|max:50',
            'password' => 'required|min:6',
            'rol_usuario' => 'required|max:20',
            'estado'=> 'required|max:1'
        ]);


        $usuario = User::findOrFail($numero_identificacion);

        $usuario->nombre_completo = strtoupper($request->input("nombre_completo"));
        $usuario->password = bcrypt($request->input("password"));
        $usuario->rol_usuario = strtoupper($request->input("rol_usuario"));
        $usuario->estado = strtoupper($request->input("estado"));
        $usuario->save();

       
        return response()->json([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente.',
            'user' => $usuario,
        ], 200);
    }
}
