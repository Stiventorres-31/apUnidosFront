<?php

namespace App\Http\Controllers;

use App\Models\Asignacione;
use App\Models\Materiale;
use App\Models\Presupuesto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AsignacioneController extends Controller
{
    public function store(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'nombre_inmueble'          => 'required|integer|exists:inmuebles,nombre_inmueble',
            "materiales" => "required|array",
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validatedData->errors()->first(),
                'result' => $validatedData->errors(),
            ], 422);
        }


        foreach ($request->materiales as $material) {
            $validatedData = Validator::make($material, [
                'referencia_material'  => 'required|string|max:10|exists:materiales,referencia_material',
                'codigo_proyecto'      => 'required|string|max:255|exists:proyectos,codigo_proyecto',
                'cantidad_material'    => 'required|numeric',
                'costo_material'       => 'required|numeric',
            ]);

            if ($validatedData->fails()) {
                return response()->json([
                    'isError' => true,
                    'code' => 422,
                    'message' => $validatedData->errors()->first(),
                    'result' => $validatedData->errors(),
                ], 422);
            }
            // Obtener datos del material
            $dataMaterial = Materiale::where('referencia_material', $request->referencia_material)->first();

            // if (!$dataMaterial) {
            //     return response()->json([
            //         'isError' => true,
            //         'code' => 404,
            //         'message' => 'Material no encontrado',
            //         'result' => []
            //     ], 404);
            // }

            // Obtener datos del presupuesto
            $dataPresupuesto = Presupuesto::where([
                'nombre_inmueble' => strtoupper($material->nombre_inmueble),
                'referencia_material' => $material["referencia_material"],
                'codigo_proyecto' => strtoupper($material["codigo_proyecto"]),
            ])->first();

            if (!$dataPresupuesto) {
                return response()->json([
                    'isError' => true,
                    'code' => 404,
                    'message' => 'Presupuesto no encontrado',
                    'result' => ["asignacion" => $material]
                ], 404);
            }
            // Validar stock de material disponible
            if ($dataMaterial->cantidad < $material["cantidad_material"]) {
                return response()->json([
                    'isError' => true,
                    'code' => 401,
                    'message' => 'No está disponible la cantidad que requieres',
                    'result' => ["asignacion" => $material]
                ], 401);
            }

            // Validar si la cantidad sobrepasa el presupuesto
            if ($dataPresupuesto->cantidad_material < $material["cantidad_material"]) {
                return response()->json([
                    'isError' => true,
                    'code' => 401,
                    'message' => 'La cantidad sobrepasa el presupuesto',
                    'result' => ["asignacion" => $material]
                ], 401);
            }
            Asignacione::firstOrCreate([
                "nombre_inmueble" => strtoupper($request->nombre_inmueble),
                "codigo_proyecto" => strtoupper($material["codigo_proyecto"]),
                "referencia_material" => $dataMaterial->referencia_material,
                "costo_material" => $dataMaterial->costo,
                "cantidad_material" => $material["cantidad_material"],
                "numero_identificacion" => Auth::user()->numero_identificacion,
                "estado" => "A"

            ]);
        }




        // Crear asignación
        // $asignacion = new Asignacione();

        // $asignacion->numero_identificacion = $request->numero_identificacion;
        // $asignacion->referencia_material = strtoupper($request->referencia_material);
        // $asignacion->nombre_inmueble = strtoupper($request->nombre_inmueble);
        // $asignacion->codigo_proyecto = strtoupper($request->codigo_proyecto);
        // $asignacion->cantidad_material = $request->cantidad_material;
        // $asignacion->costo_material = $request->costo_material;
        // $asignacion->estado = "A";
        // $asignacion->save();

        // // Actualizar la cantidad de material disponible
        // $dataMaterial->cantidad = $dataMaterial->cantidad - $request->cantidad_material;
        // $dataMaterial->save();

        return response()->json([
            'isError'  => false,
            'code'     => 201,
            'message'  => 'Asignación creada exitosamente',
            'result'   => []
        ], 201);
    }

    public function destroy(Request $request)
    {
        $validatedData = Validator::make($request->all(), [
            'nombre_inmueble'         => 'required|string|exists:,nombre_inmueble',
            'referencia_material' => 'required|string|exists:materiales,referencia_material',
            'codigo_proyecto'     => 'required|string|exists:proyectos,codigo_proyecto'
        ]);

        if ($validatedData->fails()) {
            return response()->json([
                'isError' => true,
                'code' => 422,
                'message' => $validatedData->errors()->first(),
                'result' => $validatedData->errors(),
            ], 422);
        }

        $dataAsignacion = Asignacione::where([
            'nombre_inmueble' => strtoupper($request->nombre_inmueble),
            'referencia_material' => $request->referencia_material,
            'codigo_proyecto' => strtoupper($request->codigo_proyecto),
        ])->first();


        $dataAsignacion->estado = "E";

        $material = Materiale::find($request->referencia_material);

        $material->cantidad += $dataAsignacion->cantidad_material;
        $material->save();

        return response()->json([
            'isError' => false,
            'code' => 200,
            'message' => "Se ha eliminado con éxito",
            'result' => [],
        ], 200);
    }
}
