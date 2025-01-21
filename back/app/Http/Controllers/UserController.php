<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

use Nette\Utils\Validators;

class UserController extends Controller
{
    public function index()
    {
        $user = User::all();

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Todos los usuario registrados',
            'result' => ["usuarios" => $user],
        ], 200);
    }

    public function show($numero_identificacion)
    {
        try {
            $usuario = User::findOrFail($numero_identificacion);

            return response()->json([
                'isError' => false,
                'code' => 200,
                'message' => __('Usuario encontrado'),
                'result' => ['usuario' => $usuario],
            ]);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => __('El usuario no existe'),
                'result' => [],
            ], 404);
        }
    }


    public function store(Request $request)
    {
        $validateDate = Validators::make($request->all(), [
            'numero_identificacion' => 'required|unique:usuarios|max:20',
            'nombre_completo' => 'required|max:50',
            'password' => 'required|min:6',
            'rol_usuario' => 'required|array',
            "rol_usuario.id" => "required|min:1",
            "rol_usuario.name" => "required|max:20"
        ]);
        if ($validateDate->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validateDate->errors(),
            ], 422);
        }
        $usuario = new User();
        $usuario->numero_identificacion = $request->numero_identificacion;
        $usuario->nombre_completo = strtoupper($request->nombre_completo);
        $usuario->password = bcrypt($request->password);
        $usuario->rol_usuario = strtoupper($request->rol_usuario["name"]);
        $usuario->estado = 'A';

        $usuario->save();
        //    $usuario = User::created($request->all());
        return response()->json([
            'isError' => false,
            "code" => 201,
            'message' => 'Usuario creado exitosamente.',
            "result" => ['usuario' => $usuario],
        ], 201);
    }

    public function update(Request $request, $numero_identificacion)
    {
        $validateDate = Validators::make($request->all(), [
            'nombre_completo' => 'required|max:50',
            'password' => 'required|min:6',
            'rol_usuario' => 'required|array',
            "rol_usuario.id" => "required|min:1",
            "rol_usuario.name" => "required|max:20",
            'estado' => 'required|min:1'
        ]);

        if ($validateDate->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Verificar la información',
                'result' => $validateDate->errors(),
            ], 422);
        }

        $usuario = User::findOrFail($numero_identificacion);
        if (!$usuario) {
            return response()->json([
                'isError' => true,
                'code' => 400,
                'message' => 'El usuario no existe',
                'result' => [],
            ], 404);
        }




        $usuario->nombre_completo = strtoupper($request->input("nombre_completo"));
        $usuario->password = bcrypt($request->input("password"));
        $usuario->rol_usuario = strtoupper($request->input("rol_usuario")["name"]);
        $usuario->estado = strtoupper($request->input("estado"));
        $usuario->save();


        return response()->json([
            'isError' => false,
            "code" => 200,
            'message' => 'Usuario actualizado exitosamente.',
            "result" => ['usuario' => $usuario],
        ], 200);
    }
}
