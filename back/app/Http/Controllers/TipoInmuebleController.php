<?php

namespace App\Http\Controllers;

use App\Models\TipoInmueble;
use Illuminate\Http\Request;
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
            'nombre_tipo_inmueble' => 'required|string|unique:tipo_Inmuebles,nombre_tipo_inmueble|max:255',
            'numero_identificacion' => 'required|exists:usuarios,numero_identificacion'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Error de validación',
                'result' => $validator->errors()
            ], 422);
        }

        $tipoInmueble = new TipoInmueble();
        $tipoInmueble->nombre_tipo_inmueble= strtoupper( $request->nombre_tipo_inmueble);
        $tipoInmueble->numero_identificacion= strtoupper( $request->numero_identificacion);
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
            'result' => ["tipo_inmueble"=>$tipoInmueble]
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
            'numero_identificacion' => 'required|string|exists:usuarios,numero_identificacion',
            'estado' => 'nullable|in:A,E'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => 'Error de validación',
                'result' => $validator->errors()
            ], 422);
        }

        $tipoInmueble->update([
            'nombre_tipo_inmueble' => $request->nombre_tipo_inmueble,
            'numero_identificacion' => $request->numero_identificacion,
            'estado' => $request->estado ?? $tipoInmueble->estado
        ]);

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Tipo de inmueble actualizado exitosamente',
            'result' => ["tipo_inmueble"=>$tipoInmueble]
        ], 200);
    }
}
