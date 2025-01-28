<?php

namespace App\Http\Controllers;

use App\Models\TipoInmueble;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TipoInmuebleController extends Controller
{
    public function index()
    {
        $tiposInmuebles = TipoInmueble::all();

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Todos los tipos de inmuebles registrados',
            'result' => ["tipo_inmueble" => $tiposInmuebles]
        ], 200);
    }

    public function store(Request $request)
    {


        $validator = Validator::make($request->all(), [
            'nombre_tipo_inmueble' => 'required|string|unique:tipo_inmuebles,nombre_tipo_inmueble|max:255',

        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validator->errors()->first(),
                'result' => $validator->errors()
            ], 422);
        }

        $tipoInmueble = new TipoInmueble();
        $tipoInmueble->nombre_tipo_inmueble = strtoupper($request->nombre_tipo_inmueble);
        $tipoInmueble->numero_identificacion = Auth::user()->numero_identificacion;
        $tipoInmueble->estado = "A";
        $tipoInmueble->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Tipo de inmueble creado con éxito',
            'result' => ["tipo_inmueble" => $tipoInmueble]
        ], 201);
    }

    public function show($id)
    {
        $tipoInmueble = TipoInmueble::find($id);

        if (!$tipoInmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Tipo de inmueble no encontrado',
                'result' => null
            ], 404);
        }

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Tipo de inmueble encontrado',
            'result' => ["tipo_inmueble" => $tipoInmueble]
        ], 200);
    }
    public function update(Request $request, $id)
    {
        $tipoInmueble = TipoInmueble::find($id);

        if (!$tipoInmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'Tipo de inmueble no encontrado',
                'result' => null
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre_tipo_inmueble' => 'required|string|unique:tipo_inmuebles,nombre_tipo_inmueble,' . $id,

        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validator->errors()->first(),
                'result' => $validator->errors()
            ], 422);
        }

        $tipoInmueble->update([
            'nombre_tipo_inmueble' => $request->nombre_tipo_inmueble,
            'numero_identificacion' => auth::user()->numero_identificacion

        ]);

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Tipo de inmueble actualizado exitosamente',
            'result' => ["tipo_inmueble" => $tipoInmueble]
        ], 200);
    }

    public function destroy($id)
    {

        $validator = Validator::make(['id' => $id], [
            'id' => 'required|exists:tipo_inmuebles,id', // Verifica que exista el ID en la tabla tipo_inmuebles
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => $validator->errors()->first(), // Devuelve el primer error
                'result' => $validator->errors()
            ], 404);
        }


        $tipo_inmueble = TipoInmueble::find($id);

        $tipo_inmueble->estado = "E";
        $tipo_inmueble->save();
        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => "Se ha eliminado con exito",
            'result' => []
        ], 200);
    }
}
