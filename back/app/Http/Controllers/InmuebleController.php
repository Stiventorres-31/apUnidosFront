<?php

namespace App\Http\Controllers;

use App\Models\Asignacione;
use App\Models\Inmueble;
use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class InmuebleController extends Controller
{
    public function index() {
        $inmueble = Inmueble::all();

        if (!$inmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'No hay inmueble registrado',
                'result' => [],
            ], 404);
        }



        return response()->json([
            'isError' => true,
            'code' => 200,
            'message' => 'Todos los inmuebles',
            'result' => ["inmueble" => $inmueble],
        ], 200);
    }
    public function show($id)
    {
        $inmueble = Inmueble::find($id);

        if (!$inmueble) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => 'El inmueble no encontrado',
                'result' => [],
            ], 404);
        }



        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha encontrado el inmueble',
            'result' => ["inmueble" => $inmueble],
        ], 200);
    }



    public function store(Request $request)
    {
        $validateData = Validator::make($request->all(), [
            "tipo_inmueble" => "required|exists:tipo_inmuebles,id",
            "codigo_proyecto" => "required|exists:proyectos,codigo_proyecto",
            "nombre_inmueble" => "required|unique:inmuebles,nombre_inmueble|max:255",
            'numero_identificacion' => 'required|string|exists:usuarios,numero_identificacion|max:20',
        ]);

        if ($validateData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validateData->errors()->first(), 
                'result' => $validateData->errors(),
            ], 422);
        }

        $inmueble = new Inmueble();

        $inmueble->nombre_inmueble = strtoupper($request->nombre_inmueble);
        $inmueble->tipo_inmueble = strtoupper($request->tipo_inmueble);
        $inmueble->codigo_proyecto = strtoupper($request->codigo_proyecto);
        $inmueble->numero_identificacion = strtoupper($request->numero_identificacion);
        $inmueble->save();

        return response()->json([
            'isError' => false,
            'code' => 201,
            'message' => 'Se ha creado con exito',
            'result' => ["inmueble" => $inmueble],
        ], 201);
    }

    public function destroy($id)
    {
        $validator = Validator::make(['id' => $id], [
            'id' => 'required|exists:inmuebles,id', // Verifica que exista el ID en la tabla tipo_inmuebles
        ]);
    
        if ($validator->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 404,
                'message' => $validator->errors()->first(), // Devuelve el primer error
                'result' => $validator->errors()
            ], 404);
        }

        $inmueble = Inmueble::find($id);

        $existePresupuesto = Presupuesto::where('nombre_inmueble', '=', $inmueble->nombre_inmueble)->exists();
        $existeAsignacion = Asignacione::where('nombre_inmueble', '=', $inmueble->nombre_inmueble)->exists();

        if($inmueble->estado ==="F" || $existePresupuesto || $existeAsignacion){
            return response()->json([
                'isError' => true,
                'code' => 400,
                'message' => "No se puede eliminar este inmueble. Verifica si el inmueble ya fue finalizado o tenga un presupuesto activo", // Devuelve el primer error
                'result' => []
            ], 400);
        }

        $inmueble->estado = "E";

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => 'Se ha eliminado con éxito',
            'result' => [],
        ], 200);
    }

    // public function update(Request $request, $id){
    //     $validateData = Validator::make($request->all(), [
    //         "tipo_inmueble" => "required|exists:tipo_inmuebles,id",

    //         "nombre_inmueble" => "required|unique:inmuebles,nombre_inmueble|max:255",
    //         'numero_identificacion' => 'required|string|exists:usuarios,numero_identificacion|max:20',
    //     ]);

    //     if ($validateData->fails()) {
    //         return response()->json([
    //             'isError' => true,
    //             'code' => 422,
    //             'message' => 'Verificar la información',
    //             'result' => $validateData->errors(),
    //         ], 422);
    //     }

    //     $inmueble = new Inmueble();


    //     $inmueble->tipo_inmueble = strtoupper($request->tipo_inmueble);
    //     $inmueble->codigo_proyecto = strtoupper($request->codigo_proyecto);
    //     $inmueble->numero_identificacion = strtoupper($request->numero_identificacion);
    //     $inmueble->save();

    //     return response()->json([
    //         'isError' => false,
    //         'code' => 201,
    //         'message' => 'Se ha creado con exito',
    //         'result' => ["inmueble" => $inmueble],
    //     ], 201);
    // }
}
